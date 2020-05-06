import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { keys, matches } from 'carbon-components-react/es/internal/keyboard';

import { settings } from '../../constants/Settings';

const { prefix, iotPrefix } = settings;

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
    showLabel,
    stepWidth,
    vertical,
    invalid,
    level,
    stepNumber,
    lastItem
}) => {
    const current = (currentStep == id);
    const complete = (currentIndex > index);
    const incomplete = (currentIndex < index);
    const mainStep = (level == 0)
    const subStep = (level > 0)
    const checkmark = '✔';

    const handleClick = () => {
        onChange(id, index);
    }

    const handleKeyDown = e => {
        if (matches(e, [keys.Enter, keys.Space])) {
            onClick();
        }
    };

    const StepIcon = () => {
        const classes = classnames({
            [`step-icon`]: mainStep,
            [`step-icon-sub`]: subStep
        });

        return (
            <div className={classes}>
                {mainStep ? (<p>{complete ? checkmark : stepNumber}</p>) : complete && (<p>{checkmark}</p>)}
            </div>
        )
    };

    const StepLine = () => {
        const classes = classnames({
            [`line`]: !complete && !subStep,
            [`line-sub`]: !complete && subStep,
            [`line-complete`]: complete && !subStep,
            [`line-complete-sub`]: complete && subStep,
        });

        return (!lastItem ? <div className={classes} /> : null)
    };

    const StepLabel = () => {
        const classes = classnames({
            [`label`]: true
        });

        return (<p className={classes}>{label}</p>)
    };

    const StepSecondaryLabel = () => {
        const classes = classnames({
            [`label-optional`]: true
        });

        return (
            secondaryLabel !== null && secondaryLabel !== undefined ? (
                <p className={classes}>{secondaryLabel}</p>
            ) : null)
    };

    const StepButton = () => {
        const classes = classnames({
            [`step-button`]: true,
            [`optional-hidden`]: !showLabel && !current
        });

        return (
            <button
                className={classes}
                type="button"
                aria-disabled={disabled}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
            >
                <StepLine />
                <StepIcon />
                <StepLabel />
                <StepSecondaryLabel />
            </button>
        )
    };

    const getStepWidth = () => {
        if (stepWidth != null && stepWidth >= 0) {
            return vertical
                ? { height: `${stepWidth}rem`, minHeight: `${stepWidth}rem` }
                : { width: `${stepWidth}rem`, minWidth: `${stepWidth}rem` };
        }
        return undefined;
    };

    const classes = classnames({
        [`step-current`]: current,
        [`step-complete`]: complete,
        [`step-incomplete`]: incomplete && !current,
        [`step-disabled`]: disabled,
    });

    return (
        <li className={classes} style={getStepWidth()}>
            <StepButton />
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

    /**
     * Specify whether the step is disabled
     */
    disabled: PropTypes.bool,

    /**
     * A callback called if the step is clicked or the enter key is pressed
     */
    onClick: PropTypes.func,

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

    /**
     * Check whether it is the last step
     */
    lastItem: PropTypes.bool
}

IotProgressStep.defaultProps = {
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
    lastItem: false
}

export const IotProgressIndicator = ({
    items,
    currentItemId,
    showLabels,
    isVerticalMode,
    spaceEqually,
    stepWidth
}) => {

    const sizeOfItems = items.length;

    const getStepFromItem = ({ id, label, secondaryLabel, description }, index, level, stepNumber, lastItem = false) => {
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
                lastItem={lastItem}
            />
        )
    }

    const getSteps = (items, level = 0, lastIndex = 0) => {
        let newList = []
        let index = (level == 0) ? 0 : lastIndex
        let stepNumber = 1

        items.forEach((item, idx) => {
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
                if (level == 0 && idx == (sizeOfItems - 1)) {
                    newList.push(getStepFromItem(item, index, level, stepNumber, true))
                } else {
                    newList.push(getStepFromItem(item, index, level, stepNumber))
                    index++
                    stepNumber++
                }
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
        }
    }

    const classes = classnames({
        [`${iotPrefix}--progress`]: true,
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
