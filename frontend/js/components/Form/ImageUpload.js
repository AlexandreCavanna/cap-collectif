// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import Dropzone, { type FileRejection } from 'react-dropzone';
import { Button, Col, Row } from 'react-bootstrap';
import Input from './Input';
import PreviewMedia from './PreviewMedia';
import Fetcher, { json } from '../../services/Fetcher';
import AppBox from '~ui/Primitives/AppBox';
import { colors } from '~/utils/colors';
import Icon, { ICON_NAME, ICON_SIZE } from '~ds/Icon/Icon';
import Image from '~ui/Primitives/Image';

type Props = {|
  value: Object | Array<Object>,
  onChange: Function,
  id: string,
  className: string,
  multiple: boolean,
  accept?: string | string[],
  maxSize: number,
  minSize: number,
  disablePreview: boolean,
  disabled?: boolean,
|};

type State = {
  error: string,
  size: string,
};

export class ImageUpload extends React.Component<Props, State> {
  static defaultProps = {
    id: '',
    className: '',
    multiple: false,
    maxSize: Infinity,
    minSize: 0,
    disablePreview: false,
  };

  _deleteCheckbox: any;

  constructor(props: Props) {
    super(props);
    this._deleteCheckbox = React.createRef();
    this.state = {
      error: '',
      size: '',
    };
  }

  onDrop = (acceptedFiles: Array<File>) => {
    const { onChange, multiple, value } = this.props;
    this.setState({ error: '' });
    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('file', file);
      Fetcher.postFormData('/files', formData)
        .then(json)
        .then(res => {
          const newFile = {
            id: res.id,
            name: res.name,
            url: res.url,
          };
          this.uncheckDelete();
          const newValue = multiple ? [...value, newFile] : newFile;
          onChange(newValue);
        });
    }
  };

  onToggleDelete = () => {
    const { onChange, multiple } = this.props;
    const deleteValue = !this._deleteCheckbox.current.getValue();
    if (deleteValue) {
      onChange(multiple ? [] : null);
    }
  };

  uncheckDelete = () => {
    const ref = this._deleteCheckbox;
    if (ref && ref.current) {
      $(ref.current.getDOMNode()).prop('checked', false);
    }
  };

  removeMedia = (media: Object) => {
    const { onChange, multiple, value } = this.props;
    const newValue = multiple ? value.filter(m => m.id !== media.id) : null;
    onChange(newValue);
  };

  render() {
    const { className, id, multiple, accept, maxSize, minSize, disablePreview, value, disabled } =
      this.props;
    const { error, size } = this.state;
    const classes = {
      'image-uploader': true,
    };
    if (className) {
      classes[className] = true;
    }

    if (disabled) {
      return null;
    }

    const dropzoneTextForFile = (
      <div>
        <FormattedMessage id="global.image_uploader.file.dropzone" />
        <br />
        <FormattedMessage id="global.or" />
      </div>
    );

    const dropzoneTextForImage = (
      <div>
        <FormattedMessage id="global.image_uploader.image.dropzone" />
      </div>
    );

    return (
      <Row id={id} className={classNames(classes)}>
        {disablePreview && (
          <Col xs={12} sm={12}>
            <PreviewMedia
              medias={Array.isArray(value) ? value : [value]}
              onRemoveMedia={media => {
                this.removeMedia(media);
              }}
            />
          </Col>
        )}
        <Col xs={12} sm={12}>
          <Dropzone
            ref="dropzone"
            onDrop={this.onDrop}
            multiple={multiple}
            accept={accept}
            minSize={minSize}
            maxSize={maxSize}
            onDropRejected={(fileRejections: Array<FileRejection>) => {
              this.setState({
                error: fileRejections[0].errors[0].code,
                size: (fileRejections[0].file.size / 1000000).toPrecision(2),
              });
            }}
            disablePreview={disablePreview}>
            {({ getRootProps, getInputProps }) => (
              <div className="image-uploader__dropzone--fullwidth">
                <div {...getRootProps()} className="image-uploader__dropzone-label">
                  {multiple ? dropzoneTextForFile : dropzoneTextForImage}
                  <p style={{ textAlign: 'center' }}>
                    <Button className="image-uploader__btn">
                      <input {...getInputProps()} id={`${id}_field`} />
                      <FormattedMessage
                        id={
                          multiple ? 'global.image_uploader.file.btn' : 'global.form.ranking.select'
                        }
                      />
                    </Button>
                  </p>
                </div>
              </div>
            )}
          </Dropzone>
        </Col>
        {!disablePreview && (
          <Col xs={12} sm={12}>
            {value && (
              <p className="h5 text-center">
                <FormattedMessage id="global.image_uploader.image.preview" />
              </p>
            )}
            <div className="image-uploader__preview text-center">
              {value && Array.isArray(value) ? (
                value.map(media => (
                  <Image alt="" key={media.id} src={media.url} className="img-responsive" />
                ))
              ) : (
                <Image alt="" src={value.url} className="img-responsive" />
              )}
            </div>
            {value && (
              <Input
                type="checkbox"
                id={`${id}_delete`}
                name="image-uploader__delete"
                className="text-center"
                onChange={this.onToggleDelete}
                wrapperClassName="checkbox"
                ref={this._deleteCheckbox}>
                <FormattedMessage id="global.image_uploader.image.delete" />
              </Input>
            )}
          </Col>
        )}
        {error && error.length > 0 && (
          <Col xs={12} sm={12}>
            <AppBox mt={4} color={colors.dangerColor} className="wrapper-error">
              <Icon
                name={ICON_NAME.ERROR}
                color={colors.dangerColor}
                size={ICON_SIZE.SM}
                verticalAlign="-3px"
              />
              &nbsp;
              <FormattedMessage id={error} values={{ size }} />
            </AppBox>
          </Col>
        )}
      </Row>
    );
  }
}

export default ImageUpload;
