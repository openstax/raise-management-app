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
/**
 * Configuration model for Qualtrics study
 * @export
 * @interface StudyQualtricsConfig
 */
export interface StudyQualtricsConfig {
    /**
     * 
     * @type {string}
     * @memberof StudyQualtricsConfig
     */
    url: string;
    /**
     * 
     * @type {string}
     * @memberof StudyQualtricsConfig
     */
    secret: string;
}

export function StudyQualtricsConfigFromJSON(json: any): StudyQualtricsConfig {
    return StudyQualtricsConfigFromJSONTyped(json, false);
}

export function StudyQualtricsConfigFromJSONTyped(json: any, ignoreDiscriminator: boolean): StudyQualtricsConfig {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'url': json['url'],
        'secret': json['secret'],
    };
}

export function StudyQualtricsConfigToJSON(value?: StudyQualtricsConfig | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'url': value.url,
        'secret': value.secret,
    };
}

