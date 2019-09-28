export const button = {
  name: 'button',
  type: 'object',
  title: 'Image Button',
  fields: [
    {
      type: 'image',
      name: 'image',
      title: 'Image',
      validation: (Rule) => Rule.required(),
    },
    {
      type: 'string',
      name: 'label',
      title: 'Label',
      description:
        'Alt text / optional label for the buttons. For instance, the name of the video or website you are linking to',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'x',
      title: 'X-position (0-100)',
      type: 'number',
      validation: (Rule) =>
        Rule.required()
          .min(0)
          .max(100),
    },
    {
      name: 'y',
      title: 'Y-position (0-100)',
      type: 'number',
      validation: (Rule) =>
        Rule.required()
          .min(0)
          .max(100),
    },
    {
      name: 'w',
      title: 'Width (0-100)',
      description: 'image width relative to the video / viewport',
      type: 'number',
      validation: (Rule) =>
        Rule.required()
          .min(0)
          .max(100),
    },
    {
      name: 'animation',
      title: 'Animation',
      type: 'string',
      options: {
        list: [
          { value: 'shrinkGrow', title: 'Shrink & Grow' },
          { value: 'shake', title: 'Shake' },
          { value: 'hFilp', title: 'Flip' },
          { value: 'spin', title: 'Spin' },
        ],
      },
    },
    {
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          { value: 'random', title: 'Random Site' },
          { value: 'site', title: 'Specified Site' },
        ],
        layout: 'radio',
      },
    },
    {
      name: 'siteLink',
      title: 'Site Link',
      description: 'Will be ignored if Link Type is set to "random"',
      type: 'reference',
      to: [{ type: 'website' }],
    },
  ],
}
