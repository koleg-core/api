export interface SerializerRoot<E, T> {

  deserialize(model: T): E;
  serialize(model: E): T;
}