export { saveResourceFn } from "#/modules/library/server/save-resource";
export type { SaveResourceInput } from "#/modules/library/server/save-resource";

export type { LibraryPort } from "#/modules/library/domain/ports/library-port";
export type {
  SaveResource,
  SaveResourceInput as SaveResourceUseCaseInput,
} from "#/modules/library/application";
export type {
  SavedUserResource,
  UserResourceStatus,
} from "#/modules/library/domain/entities/user-resource";
export type { LibraryError } from "#/modules/library/domain/errors/library-errors";
