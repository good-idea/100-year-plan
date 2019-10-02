const timePattern = /^\d{1,2}:\d{2}$/

const digitPattern = /\d{1,2}/g

const validateMinutesSeconds = (value) => {
  const matches = Array.from(value.matchAll(digitPattern))
  return matches.reduce((prev, current) => {
    if (prev !== true) return prev
    const value = match[0]
    const time = parseInt(value, 10)
    if (time < 0 || time >= 60) {
      return 'Minutes and seconds must be between 0 and 59'
    }
    return true
  }, true)
}

export const time = {
  name: 'videoTime',
  title: 'Time',
  type: 'string',
  validation: (Rule) =>
    Rule.required().custom((value) => {
      if (!timePattern.test(value)) {
        return 'The value must be in the format mm:ss - i.e. "0:10", ""'
      }
      return validateMinutesSeconds(value)
    }),
}

export const duration = {
  name: 'duration',
  title: 'Duration',
  type: 'object',
  fields: [
    {
      name: 'start',
      title: 'Start Time',
      type: 'videoTime',
    },
    {
      name: 'end',
      title: 'End Time',
      type: 'videoTime',
    },
  ],
}

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
      description:
        'image width relative to the video (100yearplan.world) or viewport (all other sites)',
      type: 'number',
      validation: (Rule) =>
        Rule.required()
          .min(0)
          .max(100),
    },
    {
      name: 'durations',
      title: 'Visible Durations',
      description: 'leave blank to be always',
      type: 'array',
      of: [{ type: 'duration' }],
    },
    {
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
