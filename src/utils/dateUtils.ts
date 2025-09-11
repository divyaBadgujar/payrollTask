import dayjs from "dayjs";

export type DueDateLabel = {
  label: string;
  time: string;
  type: "today" | "tomorrow" | "past" | "future";
};

export const formatDueDate = (dateString: string | Date): DueDateLabel => {
  const today = dayjs().startOf("day");
  const tomorrow = today.add(1, "day");
  const dueDate = dayjs(dateString);

  if (dueDate.isSame(today, "day")) {
    return { label: "Today", time: dueDate.format("h:mm A"), type: "today" };
  }

  if (dueDate.isSame(tomorrow, "day")) {
    return { label: "Tomorrow", time: dueDate.format("h:mm A"), type: "tomorrow" };
  }

  if (dueDate.isBefore(today, "day")) {
    const diff = today.diff(dueDate, "day");
    return {
      label: `${diff} day${diff > 1 ? "s" : ""} ago`,
      time: dueDate.format("h:mm A"),
      type: "past",
    };
  }

  return { label: dueDate.format("DD MMM"), time: dueDate.format("h:mm A"), type: "future" };
};
