export interface WakatimeStats {
  languages: WakatimeLanguage[];
  total_seconds_including_other_language: number;
  human_readable_range: string;
}

export interface WakatimeLanguage {
  decimal: string;
  digital: string;
  hours: number;
  minutes: number;
  name: string;
  percent: number;
  text: string;
  total_seconds: number;
}
