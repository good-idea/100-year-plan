import S from '@sanity/desk-tool/structure-builder'
import { MdSettings } from 'react-icons/md'

export default () =>
  S.list()
    .title('100 Year Plan')
    .items([
      S.listItem()
        .title('Websites')
        .child(S.documentTypeList('website')),
      S.listItem()
        .title('Pages')
        .child(S.documentTypeList('page')),
      S.listItem()
        .title('Videos')
        .child(S.documentTypeList('mux.videoAsset')),
      S.listItem()
        .title('Settings')
        .icon(MdSettings)
        .child(
          S.editor()
            .id('config')
            .schemaType('siteSettings')
            .documentId('siteSettings'),
        ),
    ])
