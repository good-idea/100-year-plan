export const page = {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URI',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
      },
    },
    {
      name: 'body',
      title: 'Text',
      type: 'array',
      of: [
        {
          type: 'image',
          fields: [
            {
              type: 'string',
              name: 'link',
              title: 'Link',
              options: { isHighlighted: true },
            },
          ],
        },
        {
          type: 'block',
          styles: [
            {
              title: 'Heading',
              value: 'h2',
            },
          ],
        },
      ],
    },
  ],
}
