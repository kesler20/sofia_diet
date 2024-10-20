import DatabaseInterface from "./models/DatabaseInterface";
import {
  NoSQLDbServiceResourceType,
} from "@lib/types";
import { CardDetail } from "./pages/data_stream_designer/DataStreamDesignerPage";

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
    `resources/development_${resourcePath}`,
    {
      resourceName,
      resourceContent,
    }
  );
};

export const readResourceInDb = async <TResponse>(resourcePath: string) => {
  // connectors are always created and parsed to production
  const environment =
    resourcePath === CardDetail.Connector ? "production" : "development";
  return db.READ<TResponse>(`resources/${environment}_${resourcePath}`);
};

export const readResourceByNameInDb = async <TResponse>(
  resourcePath: string,
  resourceName: string
) => {
  const environment =
    resourcePath === CardDetail.Connector ? "production" : "development";
  return db.READ<TResponse>(
    `resources/${environment}_${resourcePath}/${resourceName}`
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
