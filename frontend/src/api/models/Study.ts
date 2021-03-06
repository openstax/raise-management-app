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
    StudyStatusValues,
    StudyStatusValuesFromJSON,
    StudyStatusValuesFromJSONTyped,
    StudyStatusValuesToJSON,
} from './';

/**
 * Study response model
 * @export
 * @interface Study
 */
export interface Study {
    /**
     * 
     * @type {StudyStatusValues}
     * @memberof Study
     */
    status: StudyStatusValues;
    /**
     * 
     * @type {string}
     * @memberof Study
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof Study
     */
    description: string;
    /**
     * 
     * @type {StudyQualtricsConfig}
     * @memberof Study
     */
    _configuration: StudyQualtricsConfig;
    /**
     * 
     * @type {number}
     * @memberof Study
     */
    id: number;
    /**
     * 
     * @type {string}
     * @memberof Study
     */
    owner: string;
}

export function StudyFromJSON(json: any): Study {
    return StudyFromJSONTyped(json, false);
}

export function StudyFromJSONTyped(json: any, ignoreDiscriminator: boolean): Study {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'status': StudyStatusValuesFromJSON(json['status']),
        'title': json['title'],
        'description': json['description'],
        '_configuration': StudyQualtricsConfigFromJSON(json['configuration']),
        'id': json['id'],
        'owner': json['owner'],
    };
}

export function StudyToJSON(value?: Study | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'status': StudyStatusValuesToJSON(value.status),
        'title': value.title,
        'description': value.description,
        'configuration': StudyQualtricsConfigToJSON(value._configuration),
        'id': value.id,
        'owner': value.owner,
    };
}

