/**
 * TODO write ngDoc
 *
 * @author Maximilian Maihöfner
 * @since 06/27/2021
 */
export interface Special {
  attribute: string;
  modifier: number;
}

export interface Upbringing {
  name: string;
  special: Special[],
  environments: string[];
}

export const upbringings: Upbringing[] = [{
  name: "Farmer",
  special: [{
    attribute: "str",
    modifier: 3
  }, {
    attribute: "ch",
    modifier: -3
  }],
  environments: ["Town", "Country"]
}, {
  name: "Laborer",
  special: [{
    attribute: "str",
    modifier: 2
  }, {
    attribute: "t",
    modifier: 1
  }, {
    attribute: "cr",
    modifier: -3
  }],
  environments: []
}, {
  name: "Military",
  special: [{
    attribute: "ld",
    modifier: 3
  }, {
    attribute: "ch",
    modifier: -3
  }],
  environments: []
}, {
  name: "Nobility",
  special: [{
    attribute: "ch",
    modifier: 5
  }, {
    attribute: "ld",
    modifier: 5
  }, {
    attribute: "str",
    modifier: -5
  }, {
    attribute: "t",
    modifier: -5
  }],
  environments: []
}, {
  name: "Aristocracy",
  special: [{
    attribute: "str",
    modifier: 5
  }, {
    attribute: "ch",
    modifier: -5
  }],
  environments: []
}, {
  name: "Street Urchin",
  special: [{
    attribute: "wounds",
    modifier: 2
  }],
  environments: ["Town", "City"]
}, {
  name: "Wastelander",
  special: [{
    attribute: "t",
    modifier: 5
  }, {
    attribute: "cr",
    modifier: -5
  }],
  environments: ["Forst/Jungle", "Wasteland"]
}, {
  name: "War Orphan",
  special: [{
    attribute: "cr",
    modifier: 5
  }, {
    attribute: "ld",
    modifier: -5
  }],
  environments: []
}, {
  name: "Fugitive",
  special: [{
    attribute: "str",
    modifier: 3
  }, {
    attribute: "t",
    modifier: 3
  }, {
    attribute: "ld",
    modifier: -3
  }, {
    attribute: "ch",
    modifier: -3
  }],
  environments: []
}, {
  name: "Commoner",
  special: [],
  environments: []
}];
