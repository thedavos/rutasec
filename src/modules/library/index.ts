export { getPersonalLibraryFn } from "#/modules/library/server/get-personal-library";
export { getResourceSaveStatusFn } from "#/modules/library/server/get-resource-save-status";
export { getUserResourceFn } from "#/modules/library/server/get-user-resource";
export { saveResourceFn } from "#/modules/library/server/save-resource";
export { updateUserResourceFn } from "#/modules/library/server/update-user-resource";
export type { GetPersonalLibraryInput } from "#/modules/library/server/get-personal-library";
export type {
  ResourceSaveStatus,
  ResourceSaveStatusInput,
} from "#/modules/library/server/get-resource-save-status";
export type { GetUserResourceInput } from "#/modules/library/server/get-user-resource";
export type { SaveResourceInput } from "#/modules/library/server/save-resource";
export type { UpdateUserResourceServerInput } from "#/modules/library/server/update-user-resource";

export type { LibraryPort } from "#/modules/library/domain/ports/library-port";
export type {
  GetPersonalLibrary,
  GetPersonalLibraryInput as GetPersonalLibraryUseCaseInput,
  GetUserResource,
  GetUserResourceInput as GetUserResourceUseCaseInput,
  SaveResource,
  SaveResourceInput as SaveResourceUseCaseInput,
  UpdateUserResource,
  UpdateUserResourceInput as UpdateUserResourceUseCaseInput,
} from "#/modules/library/application";
export type {
  PersonalLibrary,
  PersonalLibraryItem,
} from "#/modules/library/domain/entities/personal-library-item";
export {
  USER_RESOURCE_STATUSES,
  type SavedUserResource,
  type UserResourceStatus,
} from "#/modules/library/domain/entities/user-resource";
export type { LibraryError } from "#/modules/library/domain/errors/library-errors";
