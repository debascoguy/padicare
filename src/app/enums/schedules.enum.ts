export enum Schedules {
  DayOfWeek = "DAY_OF_WEEK", //DayOfWeekEnum | DayOfWeekShortEnum
  TimeOfDay = "TIME_OF_DAY", //SeasonOfDay
  SpecificTimeOfDay = "SPECIFIC_TIME_OF_DAY" //HH:mm:ss
}

export enum DayOfWeekEnum {
  Sunday = "SUNDAY",
  Monday = "MONDAY",
  Tuesday = "TUESDAY",
  Wednesday = "WEDNESDAY",
  Thursday = "THURSDAY",
  Friday = "FRIDAY",
  Saturday = "SATURDAY",
}

export enum DayOfWeekShortEnum {
  Sun = "SUNDAY",
  Mon = "MONDAY",
  Tue = "TUESDAY",
  Wed = "WEDNESDAY",
  Thurs = "THURSDAY",
  Fri = "FRIDAY",
  Sat = "SATURDAY",
}

export enum SeasonOfDay {
  Mornings = "MORNINGS",
  Afternoons = "AFTERNOONS",
  Evenings = "EVENINGS",
  Overnight = "OVERNIGHTS",
}
