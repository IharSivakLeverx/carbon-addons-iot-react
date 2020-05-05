import React, { useMemo, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { ProgressIndicator as CarbonProgressIndicator } from 'carbon-components-react';
import { CheckmarkOutline16, Warning16, RadioButton16, CircleFilled16 } from '@carbon/icons-react';
import { keys, matches } from 'carbon-components-react/es/internal/keyboard';

import { settings } from '../../constants/Settings';

const { prefix, iotPrefix } = settings;

const defaultRenderLabel = props => <p {...props} />;

const defaultTranslations = {
  'carbon.progress-step.complete': 'Complete',
  'carbon.progress-step.incomplete': 'Incomplete',
  'carbon.progress-step.current': 'Current',
  'carbon.progress-step.invalid': 'Invalid',
};

function translateWithId(messageId) {
  return defaultTranslations[messageId];
}

function ProgressStep({
  label,
  description,
  className,
  current,
  complete,
  invalid,
  secondaryLabel,
  disabled,
  onClick,
  renderLabel: ProgressStepLabel,
  translateWithId: t,
  showLabel,
  stepWidth,
  vertical,
  stepNumber,
  nestingLevel,
}) {
  const classes = classnames({
    [`${prefix}--progress-step`]: true,
    [`${prefix}--progress-step--current`]: current,
    [`${prefix}--progress-step--complete`]: complete,
    [`${prefix}--progress-step--incomplete`]: !complete && !current,
    [`${prefix}--progress-step--disabled`]: disabled,
    [className]: className,
  });

  const handleKeyDown = e => {
    if (matches(e, [keys.Enter, keys.Space])) {
      onClick();
    }
  };

  const SVGIcon = () => {
    if (invalid) {
      return <Warning16 className={`${prefix}--progress__warning`} />;
    }
    if (current) {
      return (
        <CircleFilled16>
          {nestingLevel == 0 && (
            <text x="9" y="24">
              {stepNumber}
            </text>
          )}
          <title>{description}</title>
        </CircleFilled16>
      );
    }
    if (complete) {
      return (
        <CheckmarkOutline16>
          {nestingLevel == 0 && (
            <text x="9" y="24">
              {stepNumber}
            </text>
          )}
          <title>{description}</title>
        </CheckmarkOutline16>
      );
    }
    return (
      <RadioButton16>
        {nestingLevel == 0 && (
          <text x="9" y="24">
            {stepNumber}
          </text>
        )}
        <title>{description}</title>
      </RadioButton16>
    );
  };

  let message = t('carbon.progress-step.incomplete');

  if (current) {
    message = t('carbon.progress-step.current');
  }

  if (complete) {
    message = t('carbon.progress-step.complete');
  }

  if (invalid) {
    message = t('carbon.progress-step.invalid');
  }

  const getStepWidth = () => {
    if (stepWidth != null && stepWidth >= 0) {
      return vertical
        ? { height: `${stepWidth}rem`, minHeight: `${stepWidth}rem` }
        : { width: `${stepWidth}rem`, minWidth: `${stepWidth}rem` };
    }
    return undefined;
  };

  const buttonClasses = classnames({
    [`${prefix}--progress-step-button`]: true,
    [`${iotPrefix}--progress-optional-hidden`]: !showLabel && !current,
    [`${prefix}--progress-step-button--unclickable`]: !onClick || current,
  });

  const secondaryLabelClasses = classnames({
    [`${prefix}--progress-optional`]: true,
    [className]: className,
  });

  return (
    <li className={classes} style={getStepWidth()}>
      <button
        className={buttonClasses}
        type="button"
        aria-disabled={disabled}
        tabIndex={!current && onClick ? 0 : -1}
        onClick={!current ? onClick : undefined}
        onKeyDown={handleKeyDown}
      >
        <span className={`${prefix}--progress-line`} />
        <span className={`${prefix}--assistive-text`}>{message}</span>
        <SVGIcon />
        <ProgressStepLabel className={`${prefix}--progress-label`}>{label}</ProgressStepLabel>
        {secondaryLabel !== null && secondaryLabel !== undefined ? (
          <p className={secondaryLabelClasses}>{secondaryLabel}</p>
        ) : null}
      </button>
    </li>
  );
}

ProgressStep.propTypes = {
  /**
   * Provide the label for the <ProgressStep>
   */
  label: PropTypes.node.isRequired,

  /**
   * Provide an optional className to be applied to the containing <li> node
   */
  className: PropTypes.string,

  /**
   * Specify whether the step is the current step
   */
  current: PropTypes.bool,

  /**
   * Specify whether the step has been completed
   */
  complete: PropTypes.bool,

  /**
   * Provide a description for the <ProgressStep>
   */
  description: PropTypes.string,

  /**
   * Specify whether the step is invalid
   */
  invalid: PropTypes.bool,

  /**
   * Provide an optional secondary label
   */
  secondaryLabel: PropTypes.string,

  /*
   * An optional parameter to allow for overflow content to be rendered in a
   * tooltip.
   */
  renderLabel: PropTypes.func,

  /**
   * Specify whether the step is disabled
   */
  disabled: PropTypes.bool,

  /**
   * A callback called if the step is clicked or the enter key is pressed
   */
  onClick: PropTypes.func,

  /**
   * Optional method that takes in a message id and returns an
   * internationalized string.
   */
  translateWithId: PropTypes.func,

  /**
   * The option to hide secondaryLabel
   */
  showLabel: PropTypes.bool,

  /**
   * A way to use custom width for progress-step-button
   */
  stepWidth: PropTypes.number,

  /**
   * Used for stepWidht calculation in vertical state
   */
  vertical: PropTypes.bool,

  /**
   * Used to define a sub step
   */
  subStep: PropTypes.bool,

  /**
   * The number for the main step svg
   */
  stepNumber: PropTypes.number,
};

ProgressStep.defaultProps = {
  renderLabel: defaultRenderLabel,
  translateWithId,
  showLabel: true,
  vertical: false,
  secondaryLabel: null,
  className: null,
  stepWidth: null,
  onClick: null,
  complete: false,
  current: false,
  description: null,
  invalid: false,
  disabled: false,
  subStep: false,
  stepNumber: null,
};

const IDPropTypes = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

const propTypes = {
  /** array of item objects with id and labels */
  items: PropTypes.arrayOf(
    PropTypes.shape({ id: IDPropTypes, label: PropTypes.string.isRequired })
  ),
  /** id of current step */
  currentItemId: IDPropTypes,
  /** function on click, usually to set the currentItemId */
  onClickItem: PropTypes.func,
  /** false to hide labels on non-current steps */
  showLabels: PropTypes.bool,
  /** width of step in px */
  stepWidth: PropTypes.number,
  /** progress indicator is vertical */
  isVerticalMode: PropTypes.bool,
};

const defaultProps = {
  items: null,
  onClickItem: null,
  showLabels: true,
  stepWidth: null,
  currentItemId: null,
  isVerticalMode: false,
};

/**
 * This component extends the default Carbon ProgressIndicator.
 * It adds the ability to hideLabels on non-current steps and set a maximum stepWidth in pixels
 */
const ProgressIndicator = ({
  items,
  showLabels,
  currentItemId,
  onClickItem,
  stepWidth,
  className,
  isVerticalMode,
}) => {
  const renderItemAndChildren = (item, level, index) => {
    const hasChildren = item.children && item.children.length > 0;
    const itemStep = (
      <ProgressStep
        id={item.id}
        key={`${item.id}-step-item-${level}`}
        nestingLevel={level}
        label={item.label}
        secondaryLabel={item.secondaryLabel}
        description={item.description || item.label}
        showLabel={showLabels}
        stepWidth={stepWidth}
        vertical={isVerticalMode}
        stepNumber={index + 1}
      />
    );
    const res = hasChildren
      ? [
        itemStep,
        ...item.children.map((child, idx) => renderItemAndChildren(child, level + 1, idx)),
      ]
      : itemStep;
    return res;
  };

  const listSteps = items.reduce((acc, item, index) => {
    const stepItems = renderItemAndChildren(item, 0, index);
    return acc.concat(stepItems.length > 0 ? stepItems : [stepItems]);
  }, []);


  const handleChange = index => {
    if (onClickItem) {
      // Parent components are expecting the id not the index
      onClickItem(items[index].id);
    }
  };

  const matchingIndex = useMemo(() => items.findIndex(item => item.id === currentItemId), [
    items,
    currentItemId,
  ]);

  const currentStep = matchingIndex > -1 && matchingIndex;


  return (
    <CarbonProgressIndicator
      className={classnames(className, `${iotPrefix}--progress-indicator`)}
      data-testid="progress-indicator-testid"
      onChange={handleChange}
      currentIndex={currentStep}
      vertical={isVerticalMode}
    >
      {listSteps}
    </CarbonProgressIndicator>
  );
};

ProgressIndicator.propTypes = propTypes;
ProgressIndicator.defaultProps = defaultProps;

export default ProgressIndicator;
