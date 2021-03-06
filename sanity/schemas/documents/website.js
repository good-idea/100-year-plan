export const website = {
  name: 'website',
  title: 'Website',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Website Name',
      type: 'string',
      description: 'Used in the browser tab, shares, and search results',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'domain',
      title: 'Website Domain',
      type: 'string',
      description: 'Just the domain name, no www or https',
      validation: (Rule) =>
        Rule.required().custom((string) => {
          if (/^[a-z0-9-_]+\.[a-z]+$/.test(string)) return true
          return 'The domain name must be all lowercase, with no spaces, and only include the name and TLD (no www)'
        }),
    },
    {
      name: 'video',
      title: 'Mux Video',
      type: 'muxVideo',
    },
    {
      name: 'playButtonImage',
      type: 'image',
      validation: (Rule) => Rule.required(),
      fields: [
        {
          name: 'maxWidth',
          title: 'Max Width',
          type: 'number',
          description: 'Optional max width (in px)',
          validation: (Rule) => Rule.min(0),
          options: {
            isHighlighted: true,
          },
        },
      ],
    },
    {
      name: 'buttons',
      type: 'array',
      of: [{ type: 'button' }],
    },
    {
      name: 'favicon',
      type: 'image',
      title: 'Favicon',
    },
    {
      name: 'seo',
      type: 'seo',
    },
  ],
}
