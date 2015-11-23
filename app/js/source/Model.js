/**
 * Model - Creates a new Model
 * @class object Model
 */
export class Model {
  constructor(modelName) {
    this.modelName = modelName;

    // Parses localStorage data as JSON and caches it in a letiable
    let localStorageContent = JSON.parse(localStorage.getItem(this.modelName));
    // Sets objectArray to the localStorageContent only if it contains data,
    // otherwise assign an empty array.
    this.objectArray = localStorageContent ? localStorageContent : [];
  }

  /**
   * getObjectIndex - Gets the index of an object using the object's ID attribute
   *
   * @function getObjectIndex
   * @param {int} id - ID of object to get index of
   * @returns {int}
   */
  getObjectIndex(id) {
    'use strict';

    // Creates a map of IDs
    let objectMap = this.objectArray.map(function (object) {
      return object.id;
    });

    return objectMap.indexOf(id);
  }

  /**
   * clear - Clears the objectArray and related localStorage
   *
   * @function clear
   */
  clear() {
    'use strict';

    this.objectArray = [];
    localStorage.removeItem(this.modelName);
  }

  /**
   * save - Saves the objectArray to localStorage
   *
   * @function save
   */
  save() {
    'use strict';

    // Converts JSON into a string to be stored in localStorage
    let stringifiedJSON = JSON.stringify(this.objectArray);

    localStorage.setItem(this.modelName, stringifiedJSON);
  }

  /**
   * get - Gets objectArray if no ID is provided, otherwise return object with
   *       the matching ID.
   *
   * @function get
   * @param {int} [id] - ID of object to get index of
   * @returns {object}
   */
  get(id) {
    'use strict';

    let objectIndex = this.getObjectIndex(id);

    // If ID is provided then return a particular object
    if (id) {
      return this.objectArray[objectIndex];
    } else {
      return this.objectArray;
    }
  }

  /**
   * set - Sets objectArray to the provided object
   *
   * @function set
   * @param {array} objects - Array of objects to be stored
   */
  set(objects) {
    'use strict';

    this.objectArray = objects;
    this.save();
  }

  /**
   * add - Adds a single object to the objectArray
   *
   * @function add
   * @param {object} object - Object to add
   */
  add(object) {
    'use strict';

    this.objectArray.push(object);
    this.save();
  }

  /**
   * delete - Deletes an object from objectArray
   *
   * @function delete
   * @param {id} id - ID of object to delete
   */
  delete(id) {
    'use strict';

    let objectIndex = this.getObjectIndex(id);

    this.objectArray.splice(objectIndex, 1);
    this.save();
  }

  /**
   * modify - Modifies an existing object in the objectArray
   *
   * @function modify
   * @param {int} id - ID of object to modify
   * @param {object} object - Object to merge/modify into the existing object
   */
  modify(id, object) {
    'use strict';

    let objectIndex = this.getObjectIndex(id);

    // Merges the provided object with an existed object
    for (let attribute in object) {
      this.objectArray[objectIndex][attribute] = object[attribute];
    }

    this.save();
  }
}
