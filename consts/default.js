exports.statuses = {
  CREATED: "created",
  IN_PROGRESS: "in_progress",
  FINISHED: "finished",
  DELETED: "deleted",
  CANCELED: "canceled",
};

exports.statusesRu = {
  [this.statuses.CREATED]: "Создан",
  [this.statuses.IN_PROGRESS]: "В работе",
  [this.statuses.FINISHED]: "Завершён",
  [this.statuses.DELETED]: "Удалён",
  [this.statuses.CANCELED]: "Отменён",
};
