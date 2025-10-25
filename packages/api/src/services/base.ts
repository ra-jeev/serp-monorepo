import { initializeDb } from '@serp/db/client';

export class BaseService {
  constructor(connectionString: string) {
    this._initDb(connectionString);
  }

  private _initDb(connectionString: string) {
    initializeDb(connectionString);
  }
}
