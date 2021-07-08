/**
 * TODO write ngDoc
 *
 * @author Maximilian Maihöfner
 * @since 06/27/2021
 */
export interface LifestyleSpecial {
  attributes: string[];
  modifier: number;
}

interface Lifestyle {
  name: string;
  roll: string;
  outcomes: {
    min: number;
    max: number;
    description: string;
    special: LifestyleSpecial[];
  }[];
}

export const lifestyles: Lifestyle[] = [
  {
    name: 'Street Fighter',
    roll: '1d10',
    outcomes: [
      {
        min: 1,
        max: 4,
        description: 'You win most of your fights',
        special: [
          {
            attributes: ['str'],
            modifier: 2,
          },
          {
            attributes: ['t'],
            modifier: -2,
          },
        ],
      },
      {
        min: 5,
        max: 8,
        description: 'You lose most of your fights',
        special: [
          {
            attributes: ['t'],
            modifier: 2,
          },
          {
            attributes: ['str'],
            modifier: -2,
          },
        ],
      },
      {
        min: 9,
        max: 10,
        description: 'Balanced fighter',
        special: [
          {
            attributes: ['str'],
            modifier: 1,
          },
          {
            attributes: ['t'],
            modifier: 1,
          },
          {
            attributes: ['ld'],
            modifier: -2,
          },
        ],
      },
    ],
  },
  {
    name: 'Wild',
    roll: '1d10',
    outcomes: [
      {
        min: 1,
        max: 5,
        description: 'Took too many risks, taken many falls',
        special: [
          {
            attributes: ['str'],
            modifier: -2,
          },
          {
            attributes: ['t'],
            modifier: 2,
          },
        ],
      },
      {
        min: 6,
        max: 9,
        description: 'Taken beatings, toughened up',
        special: [
          {
            attributes: ['wound'],
            modifier: 1,
          },
          {
            attributes: ['t'],
            modifier: -3,
          },
        ],
      },
      {
        min: 10,
        max: 10,
        description: 'Rushed through life and tough situations',
        special: [
          {
            attributes: ['t'],
            modifier: 2,
          },
          {
            attributes: ['per'],
            modifier: -2,
          },
        ],
      },
    ],
  },
  {
    name: 'Patient',
    roll: '1d5',
    outcomes: [
      {
        min: 1,
        max: 3,
        description: 'You expect things to come to you, sometimes they do',
        special: [
          {
            attributes: ['per'],
            modifier: 2,
          },
          {
            attributes: ['ch'],
            modifier: -2,
          },
        ],
      },
      {
        min: 4,
        max: 5,
        description: 'Patience has taught you a lot',
        special: [
          {
            attributes: ['int'],
            modifier: 3,
          },
          {
            attributes: ['str'],
            modifier: -2,
          },
          {
            attributes: ['t'],
            modifier: -1,
          },
        ],
      },
    ],
  },
  {
    name: 'Hunter',
    roll: '1d5',
    outcomes: [
      {
        min: 1,
        max: 3,
        description: 'You’ve hunted for a living',
        special: [
          {
            attributes: ['int'],
            modifier: -3,
          },
          {
            attributes: ['wfr', 'wfm'],
            modifier: 3,
          },
        ],
      },
      {
        min: 4,
        max: 5,
        description: 'You’ve hunted for sport',
        special: [
          {
            attributes: ['ch'],
            modifier: -3,
          },
          {
            attributes: ['wfr', 'wfm'],
            modifier: 3,
          },
        ],
      },
    ],
  },
  {
    name: 'Gamer and Gambler',
    roll: '1d5',
    outcomes: [
      {
        min: 1,
        max: 3,
        description: 'You’ve gamed for a hobby',
        special: [
          {
            attributes: ['per'],
            modifier: 3,
          },
          {
            attributes: ['str'],
            modifier: -3,
          },
        ],
      },
      {
        min: 4,
        max: 5,
        description: 'You play games with others for a living',
        special: [
          {
            attributes: ['ch'],
            modifier: 3,
          },
          {
            attributes: ['str'],
            modifier: -3,
          },
        ],
      },
    ],
  },
  {
    name: 'Wise Guy',
    roll: '1d5',
    outcomes: [
      {
        min: 1,
        max: 3,
        description: 'You’ve taken to reading, and use it to show up others',
        special: [
          {
            attributes: ['int'],
            modifier: 3,
          },
          {
            attributes: ['ld'],
            modifier: -3,
          },
        ],
      },
      {
        min: 4,
        max: 5,
        description:
          'Instead of talking your way through situations, you attempt to use your knowledge',
        special: [
          {
            attributes: ['int'],
            modifier: 2,
          },
          {
            attributes: ['ch'],
            modifier: -2,
          },
        ],
      },
    ],
  },
  {
    name: 'Fast Talker',
    roll: '1d5',
    outcomes: [
      {
        min: 1,
        max: 3,
        description: 'You have learned the ways of getting what you want',
        special: [
          {
            attributes: ['ch'],
            modifier: 2,
          },
          {
            attributes: ['ld'],
            modifier: 2,
          },
          {
            attributes: ['str'],
            modifier: -2,
          },
          {
            attributes: ['t'],
            modifier: -2,
          },
        ],
      },
      {
        min: 4,
        max: 5,
        description: 'You’ve learned to talk your way out of situations',
        special: [
          {
            attributes: ['ch'],
            modifier: 3,
          },
          {
            attributes: ['str'],
            modifier: -3,
          },
        ],
      },
    ],
  },
  {
    name: 'Weapon Training',
    roll: '1d5',
    outcomes: [
      {
        min: 1,
        max: 3,
        description: 'You’ve learned to use weapons over anything else',
        special: [
          {
            attributes: ['wfr', 'wfm'],
            modifier: 5,
          },
          {
            attributes: ['wfr', 'wfm'],
            modifier: -5,
          },
        ],
      },
      {
        min: 4,
        max: 5,
        description: 'You care more about weapons than anything',
        special: [
          {
            attributes: ['wfr', 'wfm'],
            modifier: 5,
          },
          {
            attributes: ['ch'],
            modifier: -5,
          },
        ],
      },
    ],
  },
  {
    name: 'Spiritual',
    roll: '1d5',
    outcomes: [
      {
        min: 1,
        max: 3,
        description:
          'You’ve grown with religion as a major impactor of your life',
        special: [
          {
            attributes: ['str'],
            modifier: -3,
          },
          {
            attributes: ['cr'],
            modifier: 3,
          },
        ],
      },
      {
        min: 4,
        max: 5,
        description: 'You’ve taken religion as a way of helping others',
        special: [
          {
            attributes: ['ld'],
            modifier: 3,
          },
          {
            attributes: ['t'],
            modifier: -3,
          },
        ],
      },
    ],
  },
  {
    name: 'Body Builder',
    roll: '1d5',
    outcomes: [
      {
        min: 1,
        max: 3,
        description: 'You worked out more than anything',
        special: [
          {
            attributes: ['str'],
            modifier: 3,
          },
          {
            attributes: ['t'],
            modifier: 3,
          },
          {
            attributes: ['int'],
            modifier: -3,
          },
          {
            attributes: ['per'],
            modifier: -3,
          },
        ],
      },
      {
        min: 4,
        max: 5,
        description: 'You worked out alone a lot',
        special: [
          {
            attributes: ['ch'],
            modifier: -3,
          },
          {
            attributes: ['ld'],
            modifier: -3,
          },
          {
            attributes: ['t'],
            modifier: 3,
          },
          {
            attributes: ['str'],
            modifier: 3,
          },
        ],
      },
    ],
  },
  {
    name: 'Loner',
    roll: '1d5',
    outcomes: [
      {
        min: 1,
        max: 3,
        description:
          'You isolate yourself, learning you can only depend on your own actions',
        special: [
          {
            attributes: ['ch'],
            modifier: -3,
          },
          {
            attributes: ['int'],
            modifier: 3,
          },
        ],
      },
      {
        min: 4,
        max: 5,
        description:
          'You’ve become distrustful of others, you look out for yourself',
        special: [
          {
            attributes: ['ch'],
            modifier: -3,
          },
          {
            attributes: ['per'],
            modifier: 3,
          },
        ],
      },
    ],
  },
  {
    name: 'Merchant',
    roll: '1d5',
    outcomes: [
      {
        min: 1,
        max: 2,
        description:
          'You sold goods, using quick wit to talk people into sales',
        special: [
          {
            attributes: ['ch'],
            modifier: 3,
          },
          {
            attributes: ['ld'],
            modifier: -3,
          },
        ],
      },
      {
        min: 3,
        max: 5,
        description: 'You ran a standard business of buying and selling',
        special: [
          {
            attributes: ['ld'],
            modifier: 3,
          },
          {
            attributes: ['ch'],
            modifier: -3,
          },
        ],
      },
    ],
  },
  {
    name: 'Mercenary',
    roll: '1d10',
    outcomes: [
      {
        min: 1,
        max: 2,
        description: 'You ran a Mercenary Team that took jobs for cash',
        special: [
          {
            attributes: ['ld'],
            modifier: 3,
          },
          {
            attributes: ['ch'],
            modifier: -3,
          },
        ],
      },
      {
        min: 3,
        max: 10,
        description:
          'You were a member of a Mercenary Team, which took jobs for cash',
        special: [
          {
            attributes: ['ld'],
            modifier: -3,
          },
          {
            attributes: ['cr'],
            modifier: 3,
          },
        ],
      },
    ],
  },
];
