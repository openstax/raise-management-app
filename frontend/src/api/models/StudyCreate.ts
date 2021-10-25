/* tslint:disable */
/* eslint-disable */
/**
 * OpenStax RAISE Management Application API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import {
    StudyQualtricsConfig,
    StudyQualtricsConfigFromJSON,
    StudyQualtricsConfigFromJSONTyped,
    StudyQualtricsConfigToJSON,
} from './';

/**
 * Study creation model
 * @export
 * @interface StudyCreate
 */
export interface StudyCreate {
    /**
     * 
     * @type {string}
     * @memberof StudyCreate
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof StudyCreate
     */
    description: string;
    /**
     * 
     * @type {StudyQualtricsConfig}
     * @memberof StudyCreate
     */
    _configuration: StudyQualtricsConfig;
}

export function StudyCreateFromJSON(json: any): StudyCreate {
    return StudyCreateFromJSONTyped(json, false);
}

export function StudyCreateFromJSONTyped(json: any, ignoreDiscriminator: boolean): StudyCreate {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'title': json['title'],
        'description': json['description'],
        '_configuration': StudyQualtricsConfigFromJSON(json['configuration']),
    };
}

export function StudyCreateToJSON(value?: StudyCreate | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'title': value.title,
        'description': value.description,
        'configuration': StudyQualtricsConfigToJSON(value._configuration),
    };
}

