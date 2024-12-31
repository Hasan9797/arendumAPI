const STATUSES = {
  ACTIVE: 1,
  INACTIVE: 2,
  CREATED: 3,
};

const STATUS_OPTIONS = [
  { value: STATUSES.ACTIVE, label: 'Active' },
  { value: STATUSES.INACTIVE, label: 'Inactive' },
  { value: STATUSES.CREATED, label: 'Created' },
];

const STATUS_LABELS = {
  [STATUSES.ACTIVE]: 'Active',
  [STATUSES.INACTIVE]: 'Inactive',
  [STATUSES.CREATED]: 'Created',
};

export default {
  STATUSES,
  STATUS_OPTIONS,
  STATUS_LABELS,
};
