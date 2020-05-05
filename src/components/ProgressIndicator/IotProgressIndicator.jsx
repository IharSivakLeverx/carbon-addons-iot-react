import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
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

export const IotProgressStep = ({
    id,
    index,
    label,
    secondaryLabel,
    description,
    currentStep,
    currentIndex,
    onChange,
    disabled,
    renderLabel: ProgressStepLabel,
    translateWithId: t,
    showLabel,
    stepWidth,
    vertical,
    invalid,
    level,
    stepNumber
}) => {


    const current = (currentStep == id);
    const complete = (currentIndex > index);
    const incomplete = (currentIndex < index);


    const handleClick = () => {
        onChange(id, index);
    }

    const classes = classnames({
        [`${prefix}--progress-step`]: true,
        [`${prefix}--progress-step--current`]: current,
        [`${prefix}--progress-step--complete`]: complete,
        [`${prefix}--progress-step--incomplete`]: incomplete && !current,
        [`${prefix}--progress-step--disabled`]: disabled,
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
                    {level == 0 && (
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
                    {level == 0 && (
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
                {level == 0 && (
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
        [`${prefix}--progress-step-button--unclickable`]: !onChange || current,
    });

    const secondaryLabelClasses = classnames({
        [`${prefix}--progress-optional`]: true
    });


    return (
        <li className={classes} style={getStepWidth()}>
            <button
                className={buttonClasses}
                type="button"
                aria-disabled={disabled}
                onClick={handleClick}
                onKeyDown={handleKeyDown}>
                <span className={`${prefix}--progress-line`} />
                <span className={`${prefix}--assistive-text`}>{message}</span>
                <SVGIcon />
                <ProgressStepLabel className={`${prefix}--progress-label`}>{label}</ProgressStepLabel>
                {secondaryLabel !== null && secondaryLabel !== undefined ? (
                    <p className={secondaryLabelClasses}>{secondaryLabel}</p>
                ) : null}
            </button>
        </li>
    )
}

IotProgressStep.propTypes = {
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
}

IotProgressStep.defaultProps = {
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
}


export const IotProgressIndicator = ({
    items,
    currentItemId,
    showLabels,
    isVerticalMode,
    spaceEqually,
    stepWidth
}) => {
    const getStepFromItem = ({ id, label, secondaryLabel, description }, index, level, stepNumber) => {
        return (
            <IotProgressStep
                id={id}
                key={id}
                label={label}
                secondaryLabel={secondaryLabel}
                description={description || label}
                index={index}
                currentStep={currentStep}
                currentIndex={currentIndex}
                onChange={handleChange}
                level={level}
                stepNumber={stepNumber}
                vertical={isVerticalMode}
                showLabel={showLabels}
                stepWidth={stepWidth}
            />
        )
    }

    const getSteps = (items, level = 0, lastIndex = 0) => {
        let newList = []
        let index = (level == 0) ? 0 : lastIndex
        let stepNumber = 1

        items.forEach((item) => {
            if (item.children) {

                let newVal = Object.assign({}, item)
                delete newVal.children
                newList.push(getStepFromItem(newVal, index, level, stepNumber))
                index++
                stepNumber++
                newList = newList.concat(getSteps(item.children, (level + 1), index))

                const last = newList[newList.length - 1];
                index = (last.props.index + 1)
            } else {
                newList.push(getStepFromItem(item, index, level, stepNumber))
                index++
                stepNumber++
            }

        })
        return newList
    }

    const getInitialItemId = () => {
        return currentItemId ? currentItemId : ''
    }

    const getInitialIndex = () => {
        const index = items.findIndex(item => item.id === currentItemId)
        return index > -1 ? index : 0
    }


    const [currentStep, setCurrentStep] = useState(getInitialItemId);
    const [currentIndex, setCurrentIndex] = useState(getInitialIndex);

    const handleChange = (step, index) => {
        if (currentStep != step) {
            setCurrentStep(step);
            setCurrentIndex(index)
            console.log(`Button ${step} with index ${index} triggered event`)
        }
    }

    const classes = classnames({
        [`${iotPrefix}--progress-indicator`]: true,
        [`${prefix}--progress`]: true,
        [`${prefix}--progress--vertical`]: isVerticalMode,
        [`${prefix}--progress--space-equal`]: spaceEqually && !isVerticalMode,
      });

    return (
        <ul
            className={classes}
            data-testid="progress-indicator-testid"
            onChange={handleChange}>
            {getSteps(items)}
        </ul>
    )
}

const IDPropTypes = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

IotProgressIndicator.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({ id: IDPropTypes, label: PropTypes.string.isRequired })
    ),

    currentItemId: IDPropTypes,

    onClickItem: PropTypes.func,

    showLabels: PropTypes.bool,

    stepWidth: PropTypes.number,

    isVerticalMode: PropTypes.bool,
}

IotProgressIndicator.defaultProps = {
    items: null,
    onClickItem: null,
    showLabels: true,
    stepWidth: null,
    currentItemId: null,
    isVerticalMode: false,
}

export default IotProgressIndicator
