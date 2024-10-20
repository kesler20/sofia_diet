import DatabaseInterface from "./models/DatabaseInterface";
import {
  NoSQLDbServiceResourceType,
} from "@lib/types";

const db = new DatabaseInterface();

//================================================================================//
//                                                                                //
//   SPECIFIC CRUD FUNCTION TO CREATE ENTITIES IN A NO SQL DATABASE FROM SERVER   //
//                                                                                //
//================================================================================//

// @see server.ts
export const createResourceInDb = async <TResponse>(
  resourcePath: string,
  resourceName: string,
  resourceContent: string
) => {
  return db.CREATE<NoSQLDbServiceResourceType, TResponse>(
    `resources/${resourcePath}`,
    {
      resourceName,
      resourceContent,
    }
  );
};

export const readResourceInDb = async <TResponse>(resourcePath: string) => {
  return db.READ<TResponse>(`resources/${resourcePath}`);
};

export const readResourceByNameInDb = async <TResponse>(
  resourcePath: string,
  resourceName: string
) => {
  return db.READ<TResponse>(
    `resources/${resourcePath}/${resourceName}`
  );
};

export const updateResourceInDb = async <TResponse>(
  resourcePath: string,
  resourceName: string,
  resourceContent: string
) => {
  return db.UPDATE<NoSQLDbServiceResourceType, TResponse>(
    `resources/development_${resourcePath}/${resourceName}`,
    {
      resourceName,
      resourceContent,
    }
  );
};

export const deleteResourceInDb = async <TResponse>(
  resourcePath: string,
  resourceName: string
) => {
  return db.DELETE<TResponse>(
    `resources/development_${resourcePath}/${resourceName}`
  );
};
