export enum SortOptions {
  UPDATED_DESC = "updated_desc",
  UPDATED_ASC = "updated_asc",
  REWARD_DESC = "reward_desc",
  REWARD_ASC = "reward_asc",
  NUM_HITS_DESC = "num_hits_desc",
  NUM_HITS_ASC = "num_hits_asc",
}

export const hitFilterSortOptions = [
  { value: SortOptions.UPDATED_DESC, label: "Newest" },
  { value: SortOptions.UPDATED_ASC, label: "Oldest" },
  { value: SortOptions.REWARD_DESC, label: "Highest Paying" },
  { value: SortOptions.REWARD_ASC, label: "Lowest Paying" },
  { value: SortOptions.NUM_HITS_DESC, label: "Most Available" },
  { value: SortOptions.NUM_HITS_ASC, label: "Least Available" },
];

export const hitFilterPageSizeOptions = [
  { value: "10", label: "10" },
  { value: "20", label: "20" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
];
