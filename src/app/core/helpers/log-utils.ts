// log-utils.ts

type LogType =
  | "GET_LIST"
  | "GET_ITEM"
  | "GET_NO_LOADING"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "DOWNLOAD";

const logStyles: Record<
  LogType,
  { label: string; color: string; icon: string }
> = {
  GET_LIST: { label: "[GET LIST OK]", color: "teal", icon: "📥" },
  GET_ITEM: { label: "[GET ITEM OK]", color: "dodgerblue", icon: "📄" },
  GET_NO_LOADING: { label: "[GET NoLoading OK]", color: "gray", icon: "🔍" },
  POST: { label: "[POST OK]", color: "green", icon: "📝" },
  PUT: { label: "[PUT OK]", color: "mediumslateblue", icon: "🧩" },
  PATCH: { label: "[PATCH OK]", color: "orange", icon: "🛠️" },
  DELETE: { label: "[DELETE OK]", color: "crimson", icon: "🗑️" },
  DOWNLOAD: { label: "[Download OK]", color: "darkgreen", icon: "📦" },
};

export function logSuccess(type: LogType, url: string, data?: any): void {
  const style = logStyles[type];
  const label = `${style.icon} ${style.label}: ${url}`;
  const css = `color: ${style.color}; font-weight: bold;`;

  if (data !== undefined) {
    console.log(`%c${label}`, css, data);
  } else {
    console.log(`%c${label}`, css);
  }
}









