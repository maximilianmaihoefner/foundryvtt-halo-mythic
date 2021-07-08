import { Special } from './upbringings';

/**
 * TODO write ngDoc
 *
 * @author Maximilian Maihöfner
 * @since 06/27/2021
 */
interface Environment {
  name: string;
  special: Special[];
}

export const environments: Environment[] = [
  {
    name: 'Town',
    special: [
      {
        attribute: 'ch',
        modifier: 1,
      },
      {
        attribute: 'cr',
        modifier: -1,
      },
    ],
  },
  {
    name: 'City',
    special: [
      {
        attribute: 'cr',
        modifier: 1,
      },
      {
        attribute: 'per',
        modifier: -1,
      },
    ],
  },
  {
    name: 'Country',
    special: [
      {
        attribute: 'per',
        modifier: 1,
      },
      {
        attribute: 'ch',
        modifier: -1,
      },
    ],
  },
  {
    name: 'Forst/Jungle',
    special: [
      {
        attribute: 'ch',
        modifier: 1,
      },
      {
        attribute: 'cr',
        modifier: -1,
      },
    ],
  },
  {
    name: 'Wasteland',
    special: [
      {
        attribute: 'cr',
        modifier: 1,
      },
      {
        attribute: 'ch',
        modifier: -1,
      },
    ],
  },
];
