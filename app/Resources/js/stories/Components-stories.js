// @flow
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import {
  Label,
  Alert,
  Button,
  DropdownButton,
  MenuItem,
  ProgressBar,
  Modal,
} from 'react-bootstrap';
import { AlertForm } from "../components/Alert/AlertForm";
import Pagination from '../components/Utils/Pagination';
import { Progress } from '../components/Ui/Progress';
import InlineList from '../components/Ui/List/InlineList';
import TagsList from '../components/Ui/List/TagsList';
import DarkenGradientMedia from "../components/Ui/DarkenGradientMedia";
import SixteenNineMedia from "../components/Ui/SixteenNineMedia";
import {Loader} from "../components/Ui/Loader";

const openProject = {
  step: {
    bsStyle: 'success',
    now: 50,
    label: 'en cours',
    className: null,
  },
};

const continuousProject = {
  step: {
    bsStyle: 'success',
    now: 100,
    label: 'Participation en continue',
    className: null,
  },
};

const endedProject = {
  step: {
    now: 100,
    label: 'Terminé',
    className: 'progress-bar_grey',
  },
};

const toComeProject = {
  step: {
    now: 100,
    label: 'à venir',
    className: 'progress-bar_empty'
  },
};

const labels = ['default','primary','success','warning','danger','info'];
const buttons = ['default','primary','success','warning','danger','info','link'];
const buttonsOutline = ['success','warning','danger'];
const alerts = ['success','warning','danger','info'];

const alertFormProps = [
  { description: 'Custom error message', values: { valid:false, errorMessage:"My message", invalid:true, submitSucceeded:true, submitFailed:true, submitting:false }},
  { description: 'Submit succeeded (disappear after 10s)', values: { valid:true, invalid:false, submitSucceeded:true, submitFailed:false, submitting:false}},
  { description: 'Submit failed', values: { valid:true, invalid:false, submitSucceeded:false, submitFailed:true, submitting:false}},
  { description: 'Invalid form', values: { valid:false, invalid:true, submitSucceeded:true, submitFailed:false, submitting:false}},
];

storiesOf('Components', module)
  .add('Progress', withInfo({
    source: false,
    propTablesExclude: [Progress],
    text :`
      <h2>Comment l'utiliser</h2>
    
      ~~~jsx
      // Simple progress bar
      <ProgressBar
        now={30}
        className={null}
        label="À venir"
      />
      
      // Progress bar for step
      <Progress>
        <ProgressBar
          now={50}
          className={null}
          label="À venir"
        />
      </Progress>
      ~~~
    
    `})(() => {
    return (
      <div className="ml-30 mr-30 storybook-container">
        <h1>
          Progress bar {' '}
          <a href="https://github.com/cap-collectif/platform/blob/master/app/Resources/js/stories/Components-stories.js">
            <i className="small cap cap-github"/>
          </a>
        </h1>
        <hr/>
        <h3>Simple progress bar</h3>
        <ProgressBar
          now={70}
          className={toComeProject.step.className}
          label={toComeProject.step.label}
        />
        <h3>Progress bar for step</h3>
        <h4>À venir</h4>
        <Progress className="mb-30">
          <ProgressBar
            now={toComeProject.step.now}
            className={toComeProject.step.className}
            label={toComeProject.step.label}
          />
        </Progress>
        <h4>En cours</h4>
        <Progress className="mb-30">
          <ProgressBar
            now={openProject.step.now}
            bsStyle={openProject.step.bsStyle}
            className={openProject.step.className}
            label={openProject.step.label}
          />
        </Progress>
        <h4>Participation en continue</h4>
        <Progress className="mb-30">
          <ProgressBar
            now={continuousProject.step.now}
            bsStyle={continuousProject.step.bsStyle}
            className={continuousProject.step.className}
            label={continuousProject.step.label}
          />
        </Progress>
        <h4>Terminé</h4>
        <Progress className="mb-30">
          <ProgressBar
            now={endedProject.step.now}
            className={endedProject.step.className}
            label={endedProject.step.label}
          />
        </Progress>
      </div>
    );
  }))
  .add('List',  withInfo({
    propTablesExclude: [InlineList, TagsList],
    text :`
      <h2>Comment l'utiliser</h2>
    
      ~~~jsx
      // Inline list
      <InlineList>
        <li>Element 1</li>
        <li>Element 2</li>
      </InlineList>
      
      // Tags list
      <TagsList>
        <div className="tags-list__tag">
          <i />
          List content
        </div>
        <div className="tags-list__tag">
          <i />
          List content
        </div>
      </TagsList>
      ~~~
    
    `})(() => {
    return (
      <div className="ml-30 mr-30 storybook-container">
        <h1>
          List {' '}
          <a href="https://github.com/cap-collectif/platform/blob/master/app/Resources/js/stories/Components-stories.js">
            <i className="small cap cap-github"/>
          </a>
        </h1>
        <hr/>
        <h3>Inline list</h3>
        <InlineList className="mb-30">
          <li>5 projets</li>
          <li>10 articles</li>
          <li>2 évènements</li>
          <li>4 idées</li>
        </InlineList>
        <h3>Tags list</h3>
        <TagsList className="mb-30">
          <div className="tags-list__tag">
            <i className="cap cap-marker-1-1 icon--blue" />
            5 projets
          </div>
          <div className="tags-list__tag">
            <i className="cap cap-tag-1-1 icon--blue" />
            10 articles
          </div>
          <div className="tags-list__tag">
            <i className="cap cap-tag-1-1 icon--blue" />
            2 évènements
          </div>
          <div className="tags-list__tag">
            <i className="cap cap-marker-1-1 icon--blue" />
            4 idées
          </div>
        </TagsList>
      </div>
    );
  }))
  .add('Pagination', withInfo({
    source: false,
    text :`
      <h2>Comment l'utiliser</h2>
    
      ~~~jsx
      // Inline list
      <Pagination
        nbPages={6}
        current={3}
        onChange={() => {}}
      />
      ~~~
    
    `})(() => {
    return (
      <div className="ml-30 mr-30 storybook-container">
        <h1>
          Pagination {' '}
          <a href="https://github.com/cap-collectif/platform/blob/master/app/Resources/js/stories/Components-stories.js">
            <i className="small cap cap-github"/>
          </a>
        </h1>
        <hr/>
        <div className="row">
          <Pagination
            nbPages={6}
            current={3}
            onChange={() => {}}
          />
        </div>
      </div>
    );
  }))
  .add('Labels', withInfo({
    source: false,
    text :`
      <h2>Comment l'utiliser</h2>
    
      ~~~jsx
      <Label bsStyle={labelStyle}>{label}</Label>
      ~~~
    
    `})(() => {
    return (
      <div className="ml-30 mr-30 storybook-container">
        <h1>
          Labels {' '}
          <a href="https://github.com/cap-collectif/platform/blob/master/app/Resources/js/stories/Components-stories.js">
            <i className="small cap cap-github"/>
          </a>
        </h1>
        <hr/>
        <div className="row">
          {labels.map(label => (
            <div className="col-sm-1 col-xs-6 mb-20">
              <Label bsStyle={label}>{label}</Label>
            </div>
          ))}
        </div>
      </div>
    );
  }))
  .add('Alerts', withInfo({
    source: false,
    text :`
      <h2>Comment l'utiliser</h2>
    
      ~~~jsx
      // Basic alert
      <Alert bsStyle={alertStyle}>{alert}</Alert>
      
      // Form alert
      <Pagination
        <AlertForm
          valid
          invalid={false}
          submitting={false}
          submitSucceeded={false}
          submitFailed={false}
        />
      />
      ~~~
    
    `})(() => {
    return (
      <div className="ml-30 mr-30 storybook-container">
        <h1>
          Alerts {' '}
          <a href="https://github.com/cap-collectif/platform/blob/master/app/Resources/js/stories/Components-stories.js">
            <i className="small cap cap-github"/>
          </a>
        </h1>
        <hr/>
        <h3>Basic alert</h3>
        <div className="row">
          {alerts.map(alert => (
            <div className="col-sm-3 col-xs-12 mb-10">
              <Alert bsStyle={alert}>{alert} alert</Alert>
            </div>
          ))}
        </div>
        <h3>Form alert</h3>
        {alertFormProps.map(props => (
          <div className="mb-20">
            <p>{props.description}</p>
            <AlertForm
              {...props.values}
            />
          </div>
        ))}
      </div>
    );
  }))
  .add('Buttons', withInfo({
    source: false,
    text :`
      <h2>Comment l'utiliser</h2>
    
      ~~~jsx
      // basic button
      <Button bsStyle={buttonStyle}>Mon bouton</Button>
      
      // outline button
      <Button bsStyle={buttonStyle} className="btn--outline">Mon bouton</Button>

      //dropdown button
      <DropdownButton
        open={false}
        title={buttonTitle}
      >
        <MenuItem eventKey="1">Action</MenuItem>
        <MenuItem divider />
        <MenuItem eventKey="2" active>Item actif</MenuItem>
      </DropdownButton>
      ~~~
    
    `})(() => {
    return (
      <div className="ml-30 mr-30 storybook-container">
        <h1>
          Buttons {' '}
          <a href="https://github.com/cap-collectif/platform/blob/master/app/Resources/js/stories/Components-stories.js">
            <i className="small cap cap-github"/>
          </a>
        </h1>
        <hr/>
        <div className="row">
          {buttons.map(button => (
            <div className="col-md-1 col-sm-2 col-xs-12 mb-20">
              <Button bsStyle={button}>{button}</Button>
            </div>
          ))}
          {buttonsOutline.map(button => (
            <div className="col-md-1 col-sm-2 col-xs-12 mb-20">
              <Button bsStyle={button} className="btn--outline">{button}</Button>
            </div>
          ))}
          <div className="col-md-1 col-sm-2 col-xs-12 mb-20">
            <DropdownButton
              bsStyle="primary"
              title="dropdown button"
              key="1"
              id="dropdown-basic"
            >
              <MenuItem header>Header</MenuItem>
              <MenuItem eventKey="1">Action</MenuItem>
              <MenuItem eventKey="3" active>
                Active Item
              </MenuItem>
              <MenuItem divider />
              <MenuItem eventKey="4">Separated link</MenuItem>
            </DropdownButton>
          </div>
        </div>
      </div>
    );
  }))
  .add('Modal', withInfo({
    source: false,
    propTablesExclude: [Button],
    text :`
      <h2>Comment l'utiliser</h2>
    
      ~~~jsx
      <div className="static-modal">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Titre</Modal.Title>
          </Modal.Header>
      
          <Modal.Body>Lorem ipsum...</Modal.Body>
      
          <Modal.Footer>
            <Button>Fermer</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>;
      ~~~
    
    `})(() => {
    return (
      <div className="ml-30 mr-30 storybook-container">
        <h1>
          Modal {' '}
          <a href="https://github.com/cap-collectif/platform/blob/master/app/Resources/js/stories/Components-stories.js">
            <i className="small cap cap-github"/>
          </a>
        </h1>
        <hr/>
        <div
          className="static-modal position-relative"
        >
          <Modal.Dialog className="position-relative">
            <Modal.Header>
              <Modal.Title>Titre</Modal.Title>
            </Modal.Header>

            <Modal.Body>Lorem ipsum ...</Modal.Body>

            <Modal.Footer>
              <Button>Fermer</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      </div>
    );
  }))
  .add('Media', withInfo({
    source: false,
    propTablesExclude: [Button],
    text :`
      <h2>Comment l'utiliser</h2>
    
      ~~~jsx
      // Darken gradient media
      <DarkenGradientMedia
        width="600px"
        height="400px"
        url="https://source.unsplash.com/collection/1353633"
        title="title"
      />
      
      // Sixteen  Nine Media
      <SixteenNineMedia> // depends on parent size
        <img src="https://source.unsplash.com/collection/1353633" alt="img example"/>
      </SixteenNineMedia>
      ~~~
    
    `})(() => {
    return (
      <div className="ml-30 mr-30 storybook-container">
        <h1>
          Media {' '}
          <a href="https://github.com/cap-collectif/platform/blob/master/app/Resources/js/stories/Components-stories.js">
            <i className="small cap cap-github"/>
          </a>
        </h1>
        <hr/>
        <h3>Darken gradient media</h3>
        <DarkenGradientMedia
          width="600px"
          height="400px"
          url="https://source.unsplash.com/collection/1353633"
          title="title"
        />
        <h3>16:9 media</h3>
        <div style={{ maxWidth:'400px' }} className="mb-30">
          <SixteenNineMedia>
            <img src="https://source.unsplash.com/collection/1353633" alt="img example"/>
          </SixteenNineMedia>
        </div>

      </div>
    );
  }))
  .add('Loader', withInfo({
    source: false,
    text :`
      <h2>Comment l'utiliser</h2>
    
      ~~~jsx
      <Loader />
      ~~~
    
    `})(() => {
    return (
      <div className="ml-30 mr-30 storybook-container">
        <h1>
          Loader {' '}
          <a href="https://github.com/cap-collectif/platform/blob/master/app/Resources/js/stories/Components-stories.js">
            <i className="small cap cap-github"/>
          </a>
        </h1>
        <hr/>
        <Loader />
      </div>
    );
  }));
