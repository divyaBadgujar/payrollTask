import dayjs from "dayjs";

// ------------------- TOKEN UTILS -------------------
export const getAccessToken = (): string | null => {
  return localStorage.getItem("token");
};

export const setAccessToken = (token: string): void => {
  localStorage.setItem("token", token);
};

export const removeToken = (): void => {
  localStorage.removeItem("token");
};

export const getUserId = (): string | null => {
  return localStorage.getItem("userId");
};

// ------------------- STATUS UTILS -------------------
export interface Status {
  color: string;
  text: string;
}

export const getStatus = (num: number): Status => {
  switch (num) {
    case 0:
      return { color: "#fd7e14", text: "Accepted" };
    case 100:
      return { color: "green", text: "Completed" };
    case -1:
      return { color: "red", text: "Not Accepted" };
    default:
      return { color: "blue", text: `Partial Complete (${num}%)` };
  }
};

// ------------------- MEDIA UTILS -------------------
export interface MediaDetails {
  MultimediaData: string;
  MultimediaExtension: string | undefined;
  MultimediaFileName: string;
  MultimediaType: "I" | "V";
}

export const getMediaDetails = (mediaFile: File): Promise<MediaDetails> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(mediaFile);

    reader.onload = () => {
      const base64Data = (reader.result as string).split(",")[1];
      const fileName = mediaFile.name;
      const fileExtension = fileName.split(".").pop();
      const mediaType: "I" | "V" = mediaFile.type.startsWith("image") ? "I" : "V";

      resolve({
        MultimediaData: base64Data,
        MultimediaExtension: fileExtension,
        MultimediaFileName: fileName,
        MultimediaType: mediaType,
      });
    };

    reader.onerror = () => {
      reject(new Error("Failed to read the media file."));
    };
  });
};

// ------------------- SELECT OPTIONS -------------------
export interface Option {
  label: string;
  value: string;
}

export const priorityOptions: Option[] = [
  { label: "Low", value: "Low" },
  { label: "High", value: "High" },
];

export const statusOptions: Option[] = [
  { label: "All", value: "" },
  { label: "Not Accepted", value: "-1" },
  { label: "Partial Complete", value: "-2" },
  { label: "Accepted", value: "0" },
  { label: "Completed", value: "100" },
];

// ------------------- DEFAULT TASK PAYLOAD -------------------
export interface TaskPayload {
  From: number;
  To: number;
  Title: string;
  UserId: string | null;
  IsArchive: boolean;
  UserIds: string[] | "";
  Priority: string;
  TaskStatus: string;
  FromDueDate: string;
  ToDueDate: string;
  SortByDueDate: string;
  SortColumn: string;
  SortOrder: string;
}

export const defaultTaskPayload: TaskPayload = {
  From: 1,
  To: 10,
  Title: "",
  UserId: getUserId(),
  IsArchive: false,
  UserIds: "",
  Priority: "",
  TaskStatus: "",
  FromDueDate: "",
  ToDueDate: "",
  SortByDueDate: "",
  SortColumn: "",
  SortOrder: "",
};

// ------------------- FORMAT TASK DATA -------------------
export interface TaskOwner {
  UserId: string;
  [key: string]: any;
}

export interface TaskInput {
  Description?: string;
  file?: File;
  priority?: string;
  TaskEndDate?: string;
  TaskOwners?: TaskOwner[];
  UserIds?: TaskOwner[];
  Title?: string;
  LeadId?: string;
}

export interface FormattedTask {
  Id: string;
  AssignedBy: string | null;
  AssignedToUserId: string;
  AssignedDate: string;
  CompletedDate: string;
  Description: string;
  IntercomGroupIds: string[];
  IsActive: boolean;
  Latitude: string;
  Location: string;
  Longitude: string;
  Image: string;
  MultimediaData: string;
  MultimediaExtension?: string;
  MultimediaFileName: string;
  MultimediaType: "I" | "V" | "";
  Priority: string;
  TaskEndDateDisplay?: string;
  TaskEndDate: string;
  TaskDisplayOwners: string;
  TaskOwners: TaskOwner[];
  TaskStatus: string;
  Title?: string;
  UserDisplayIds: string;
  UserIds: string[] | "";
  LeadId?: string;
}

export const formatData = async (payload: TaskInput): Promise<FormattedTask> => {
  let mediaDetails: MediaDetails | { MultimediaData: string; MultimediaExtension: string | undefined; MultimediaFileName: string; MultimediaType: "" } = {
    MultimediaData: "",
    MultimediaExtension: "",
    MultimediaFileName: "",
    MultimediaType: "",
  };

  if (payload.file) {
    try {
      mediaDetails = await getMediaDetails(payload.file);
    } catch (error: any) {
      console.error("Error processing media file:", error.message);
    }
  }

  const userIds = payload.UserIds?.map((user) => user.UserId) || "";

  return {
    Id: "",
    AssignedBy: getUserId(),
    AssignedToUserId: "",
    AssignedDate: "",
    CompletedDate: "",
    Description: payload.Description || "",
    IntercomGroupIds: [],
    IsActive: true,
    Latitude: "",
    Location: "",
    Longitude: "",
    Image: mediaDetails.MultimediaData,
    MultimediaData: mediaDetails.MultimediaData,
    MultimediaExtension: mediaDetails.MultimediaExtension,
    MultimediaFileName: mediaDetails.MultimediaFileName,
    MultimediaType: mediaDetails.MultimediaType,
    Priority: payload.priority || "",
    TaskEndDateDisplay: payload.TaskEndDate,
    TaskEndDate: dayjs(payload.TaskEndDate).format("DD MMM YYYY") + " 12:00 AM",
    TaskDisplayOwners: payload.TaskOwners?.length ? `${payload.TaskOwners.length} Users` : "",
    TaskOwners: payload.TaskOwners || [],
    TaskStatus: "",
    Title: payload.Title,
    UserDisplayIds: payload.UserIds?.length ? `${payload.UserIds.length} Users` : "",
    UserIds: userIds,
    LeadId: payload.LeadId || "",
  };
};
