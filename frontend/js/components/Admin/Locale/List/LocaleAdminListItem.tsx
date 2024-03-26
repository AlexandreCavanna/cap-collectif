import { Field } from 'redux-form'
import React, { useState } from 'react'
import { FormattedMessage, IntlShape, useIntl } from 'react-intl'
import { graphql, createFragmentContainer } from 'react-relay'

import styled from 'styled-components'
import { ListGroupItem, Button, ButtonToolbar, Badge } from 'react-bootstrap'
import config from '~/config'
import Toggle from '~/components/Form/Toggle'
import DeleteModal from '~/components/Modal/DeleteModal'
import type { LocaleAdminListItem_locale } from '~relay/LocaleAdminListItem_locale.graphql'
import UpdateLocaleStatusMutation from '~/mutations/UpdateLocaleStatusMutation'
import { toast } from '~ds/Toast'

type Props = {
  locale: LocaleAdminListItem_locale
}
const ContainerTitle = styled.div`
  display: flex;
`
const ContainerDefault = styled.div`
  height: 15px;
  padding-top: 2px;
`
const ContainerToggle = styled.div`
  .form-group {
    margin-bottom: 0;
  }
`

const onDelete = (locale: LocaleAdminListItem_locale, intl: IntlShape) => {
  UpdateLocaleStatusMutation.commit({
    input: {
      locales: [
        {
          id: locale.id,
          isEnabled: false,
          isPublished: false,
        },
      ],
    },
  }).then(() => toast({ content: intl.formatMessage({ id: 'the-language-has-been-removed' }), variant: 'success' }))
}

export const LocaleAdminListItem = ({ locale }: Props) => {
  const [showModal, displayModal] = useState(false)
  const intl = useIntl()
  return (
    <ListGroupItem
      style={{
        backgroundColor: '#FAFAFA',
      }}
    >
      <ContainerTitle>
        <ContainerToggle>
          <Field
            labelSide="LEFT"
            component={Toggle}
            label={intl.formatMessage({
              id: locale.traductionKey,
            })}
            name={`locales.${locale.id}.isPublished`}
            normalize={val => !!val}
            id={locale.id}
            disabled={locale.isDefault}
          />
        </ContainerToggle>
        {locale.isDefault && (
          <ContainerDefault>
            <Badge
              pill="true"
              variant="info"
              style={{
                backgroundColor: '#1D8393',
              }}
              className="ml-15"
            >
              <FormattedMessage id="by-default" />
            </Badge>
          </ContainerDefault>
        )}
      </ContainerTitle>
      {!locale.isDefault && (
        <ButtonToolbar>
          <Button
            id={`DeleteContact-${locale.id}`}
            className="mt-5 btn-outline-danger btn-danger"
            onClick={() => displayModal(true)}
          >
            <i className="fa fa-trash" />
            {!config.isMobile && (
              <span className="ml-5">
                <FormattedMessage id="global.delete" />
              </span>
            )}
          </Button>
        </ButtonToolbar>
      )}
      <DeleteModal
        showDeleteModal={showModal}
        closeDeleteModal={() => displayModal(false)}
        deleteElement={() => onDelete(locale, intl)}
        deleteModalTitle="are-you-sure-you-want-to-delete-this-language"
        deleteModalContent="translation-help-text"
      />
    </ListGroupItem>
  )
}
export default createFragmentContainer(LocaleAdminListItem, {
  locale: graphql`
    fragment LocaleAdminListItem_locale on Locale {
      id
      traductionKey
      code
      isEnabled
      isPublished
      isDefault
    }
  `,
})
