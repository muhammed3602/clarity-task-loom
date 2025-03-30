;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-task-not-found (err u101))
(define-constant err-unauthorized (err u102))
(define-constant err-invalid-deadline (err u103))

;; Data structures
(define-map tasks uint {
    title: (string-ascii 64),
    description: (string-ascii 256),
    deadline: uint,
    assignee: principal,
    creator: principal,
    completed: bool,
    created-at: uint
})

(define-data-var task-id-counter uint u0)

;; Private functions
(define-private (is-owner)
    (is-eq tx-sender contract-owner))

(define-private (is-task-assignee (task-id uint))
    (let ((task (unwrap! (map-get? tasks task-id) (err false))))
        (is-eq tx-sender (get assignee task))))

;; Public functions
(define-public (create-task (title (string-ascii 64)) (description (string-ascii 256)) (deadline uint) (assignee principal))
    (let ((new-id (+ (var-get task-id-counter) u1)))
        (begin
            (map-set tasks new-id {
                title: title,
                description: description,
                deadline: deadline,
                assignee: assignee,
                creator: tx-sender,
                completed: false,
                created-at: block-height
            })
            (var-set task-id-counter new-id)
            (ok new-id))))

(define-public (complete-task (task-id uint))
    (let ((task (unwrap! (map-get? tasks task-id) err-task-not-found)))
        (if (or (is-owner) (is-eq tx-sender (get assignee task)))
            (begin
                (map-set tasks task-id (merge task { completed: true }))
                (ok true))
            err-unauthorized)))

(define-public (reassign-task (task-id uint) (new-assignee principal))
    (let ((task (unwrap! (map-get? tasks task-id) err-task-not-found)))
        (if (or (is-owner) (is-eq tx-sender (get creator task)))
            (begin
                (map-set tasks task-id (merge task { assignee: new-assignee }))
                (ok true))
            err-unauthorized)))

;; Read only functions
(define-read-only (get-task (task-id uint))
    (ok (unwrap! (map-get? tasks task-id) err-task-not-found)))

(define-read-only (get-tasks-by-assignee (assignee principal))
    (ok (filter tasks (lambda (task) (is-eq (get assignee task) assignee)))))

(define-read-only (get-task-count)
    (ok (var-get task-id-counter)))
