import { createD1CatalogAdapter } from "#/modules/catalog/adapters/d1/d1-catalog-adapter";
import { createD1LibraryAdapter } from "#/modules/library/adapters/d1/d1-library-adapter";
import {
  GetPersonalLibraryUseCase,
  GetUserResourceUseCase,
  SaveResourceUseCase,
} from "#/modules/library/application";
import { getDb } from "#/shared/db";

export type LibraryModule = {
  saveResource: SaveResourceUseCase;
  getUserResource: GetUserResourceUseCase;
  getPersonalLibrary: GetPersonalLibraryUseCase;
};

export function createLibraryModule(db: D1Database): LibraryModule {
  const library = createD1LibraryAdapter(db);
  const catalog = createD1CatalogAdapter(db);

  return {
    saveResource: new SaveResourceUseCase(library, catalog),
    getUserResource: new GetUserResourceUseCase(library),
    getPersonalLibrary: new GetPersonalLibraryUseCase(library),
  };
}

export function getLibraryModule(): LibraryModule {
  return createLibraryModule(getDb());
}
