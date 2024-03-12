// The main schema type containing all collections available
export interface MySchema {
  collection_a: CollectionA[]; // regular collections are array types
  collection_b: CollectionB[];
  collection_c: CollectionC; // this is a singleton
  // junction collections are collections too
  collection_a_b_m2m: CollectionAB_Many[];
  collection_a_b_m2a: CollectionAB_Any[];
}

// collection A
interface CollectionA {
  id: number;
  status: string;
  // relations
  m2o: number | CollectionB;
  o2m: number[] | CollectionB[];
  m2m: number[] | CollectionAB_Many[];
  m2a: number[] | CollectionAB_Any[];
}

// Many-to-Many junction table
interface CollectionAB_Many {
  id: number;
  collection_a_id: CollectionA;
  collection_b_id: CollectionB;
}

// Many-to-Any junction table
interface CollectionAB_Any {
  id: number;
  collection_a_id: CollectionA;
  collection: 'collection_b' | 'collection_c';
  item: string | CollectionB | CollectionC;
}

// collection B
interface CollectionB {
  id: number;
  value: string;
}

// singleton collection
interface CollectionC {
  id: number;
  app_settings: string;
  something: string;
}
