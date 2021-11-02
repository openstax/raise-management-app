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
 * Study POST request model
 * @export
 * @interface StudyPost
 */
export interface StudyPost {
    /**
     * 
     * @type {string}
     * @memberof StudyPost
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof StudyPost
     */
    description: string;
    /**
     * 
     * @type {StudyQualtricsConfig}
     * @memberof StudyPost
     */
    _configuration: StudyQualtricsConfig;
}

export function StudyPostFromJSON(json: any): StudyPost {
    return StudyPostFromJSONTyped(json, false);
}

export function StudyPostFromJSONTyped(json: any, ignoreDiscriminator: boolean): StudyPost {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'title': json['title'],
        'description': json['description'],
        '_configuration': StudyQualtricsConfigFromJSON(json['configuration']),
    };
}

export function StudyPostToJSON(value?: StudyPost | null): any {
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
