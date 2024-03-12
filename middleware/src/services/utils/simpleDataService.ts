import { Backend, client } from '../../directus/directus';

export default class SimpleDataService<T> {
  typeName: string;
  context: any;

  constructor(typeName: string) {
    this.typeName = typeName;
    this.context = client;
  }

  static async resolveRelation<R>(
    relations: any[],
    fieldName: string,
    type: string,
    relationType: string
  ) {
    const resolver = new SimpleDataService<any>(relationType);
    const relationService = new SimpleDataService<R>(type);

    await relations
      .reduce(async (previous, relation) => {
        const result = await previous;
        return [...result, await resolver.get(relation)];
      }, Promise.resolve([]))
      .then((elements) => {
        relations = elements.map((element) => element[fieldName]);
      });

    await relations
      .reduce(async (previous, relation) => {
        const result = await previous;
        return [...result, await relationService.get(relation)];
      }, Promise.resolve([]))
      .then((elements) => {
        relations = elements.map((element) => element.id);
      });

    return relations;
  }

  public async getAll(): Promise<T[]> {
    let all: T[] = [];

    try {
      const result = await this.context.items(this.typeName).readByQuery({
        limit: -1,
      });
      all = result.data.map((element: T) => element);
    } catch (e) {
      all = [];
    }

    return all;
  }

  public async get(id: number): Promise<T | undefined> {
    let element: any = {};

    try {
      element = await this.context.items(this.typeName).readOne(id);
    } catch (e) {
      console.log(e);
      return;
    }

    return element;
  }

  public async getMany(ids: number[]): Promise<T[]> {
    let elements: any = [];

    try {
      elements = ids.map(async (id) => {
        let element;
        try {
          element = await this.context.items(this.typeName).readOne(id);
        } catch (e) {
          element = {};
        }
        return element;
      });
    } catch (e) {
      elements = [];
    }

    return elements;
  }

  public async add(element: T) {
    let addElement: any = {};

    try {
      addElement = await this.context.items(this.typeName).createOne(element);
    } catch (e) {
      console.log(e);
      return;
    }

    return addElement;
  }

  public async addAll(all: T[]) {
    let addAll: T[] = [];

    try {
      const result = await this.context.items(this.typeName).createMany(all);
      addAll = result.data.map((element: T) => element);
    } catch (e) {
      console.log(e);
      addAll = [];
    }

    return addAll;
  }

  public async update(element: any): Promise<any> {
    let updateElement = {};

    try {
      updateElement = await this.context
        .items(this.typeName)
        .updateOne(element.id, element);
    } catch (e) {
      console.log(e);
      return;
    }

    return updateElement;
  }

  public async customUpdate(element: any, uniqueKey: string): Promise<any> {
    let updateElement = {};

    try {
      updateElement = await this.context
        .items(this.typeName)
        .updateOne(element[uniqueKey], element);
    } catch (e) {
      console.log(e);
      return;
    }

    return updateElement;
  }

  public async delete(element: any) {
    const deleteElement: any = element;

    try {
      await this.context.items(this.typeName).deleteOne(element.id);
    } catch (e) {
      console.log(e);
      return;
    }

    return element;
  }

  public async customDelete(element: any, uniqueKey: string) {
    try {
      await this.context.items(this.typeName).deleteOne(element[uniqueKey]);
    } catch (e) {
      console.log(e);
      return;
    }

    return element;
  }

  public async deleteMany(ids: number[]): Promise<T[]> {
    let elements: any = [];

    try {
      elements = ids.map(async (id) => {
        let element;
        try {
          element = await this.context.items(this.typeName).deleteOne(id);
        } catch (e) {
          console.log(e);
          element = {};
        }
        return element;
      });
    } catch (e) {
      elements = [];
    }

    return elements;
  }

  public async readByQuery(query: any, limit = -1) {
    return await this.context
      .items(this.typeName)
      .readByQuery({ ...query, limit: limit });
  }
}
