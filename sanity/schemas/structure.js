import S from '@sanity/desk-tool/structure-builder'

export default () =>
  S.list()
    .title('100 Year Plan')
    .items([
      S.listItem()
        .title('Websites')
        .child(S.documentTypeList('website')),
    ])
