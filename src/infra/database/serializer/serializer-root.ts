export interface SerializerRoot<E, T> {

  deserialize(model: T): Promise<E>;
  serialize(model: E): T;
}
