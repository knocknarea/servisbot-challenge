/**
 * Definition of data that is returned from the API in pages
 *
 * @export
 * @interface Page
 * @template T the payload type
 */
export interface Page<T> {

    /**
     * What page does this information represent
     * <b>NOTE</b> Pages are ZERO based.
     *
     * @type {number}
     * @memberof Page
     */
    readonly pageNumber: number,

    /**
     * An echo of the page size that was issued with the query
     *
     * @type {number}
     * @memberof Page
     */
    readonly pageSize: number,


    /**
     * A hint/indication that there might be more information (another page after this).
     * Essentially, and it is up to the implementation to decide, but sometimes it is prudent
     * to fetch one more item than the page size of the quest, to peek ahead and potentially 
     * offset +1 from a whole page query without need.
     *
     * @type {boolean}
     * @memberof Page
     */
    readonly complete: boolean,

    /**
     * Optional: How many pages exist in the domain data
     * Depends on whether it is implemented by the API or not
     *
     * @type {number}
     * @memberof Page
     */
    readonly totalPages?: number,

    /**
     * An echo of any search term that was used to generate this page.
     * Allows for continuity
     *
     * @type {string}
     * @memberof Page
     */
    readonly query?: string,

    /**
     * The page data / payload. Never undefined, can be validly empty
     *
     * @type {T[]}
     * @memberof Page
     */
    readonly payload: T[]
}

/**
 * A representation of a request for paged data from the API.
 * This can be constructed from the request parameters, or it could
 * be JSON body (if the request is a POST request)
 *
 * @export
 * @interface PageQuery
 */
export interface PageQuery {
    /**
     * ZERO based page number required.
     *
     * @type {number}
     * @memberof PageQuery
     */
    pageNumber: number,
    /**
     * What size of page is requested
     *
     * @type {number}
     * @memberof PageQuery
     */
    pageSize: number,
    
    /**
     * Optionally any query string to filter the requests with
     *
     * @type {string}
     * @memberof PageQuery
     */
    query? : string
}

export class PaginationUtil {

    private constructor() { /* empty */ }

    public static readonly DEFAULT_PAGE_SIZE = 10;

    /**
     * In axios and on the API side, sometimes the page number
     * and size are encoded as a string. I need to fix validation on that
     * size for now, I am just forcing integer/number.
     *
     * @static
     * @param {PageQuery} query
     * @return {*}  {PageQuery}
     * @memberof PaginationUtil
     */
    public static sanitize(query: PageQuery): PageQuery {
        return { 
            pageNumber: +query.pageNumber,
            pageSize: +query.pageSize,
            query: query.query
        } as PageQuery
    }

    /**
     * Boiler plate code for slicing a page out of source data
     *
     * @template T the type of data
     * @param {T[]} source the source array of data
     * @param {PageQuery} pageQuery a valid page query
     * @param {(nstance: T, q: string) => boolean} [filter] a supplier of boolean function to filter on attributes
     * @return {*}  {Page<T>} a page
     * @memberof PaginationUtil
     */
    public static slicePage<T>(source: T[], pageQuery: PageQuery, filter?: (instance: T, q: string) => boolean): Page<T> {

        const { pageNumber, pageSize, query } = pageQuery;

        const validSize: number = pageSize > 0 ? pageSize : PaginationUtil.DEFAULT_PAGE_SIZE;
        const start: number = (pageNumber >= 0 ? pageNumber : 0) * validSize;
        const end: number = start + validSize;

        //
        // Filter first...
        //
        const filtered = query ? (source || []).filter((bot) => filter ? filter(bot, query) : true) : source;

        console.log(`Page: ${pageNumber} Size ${pageSize} Query ${query} => Valid Size ${validSize} s=${start} e=${end}`);
        // Then slice a page out of the result
        const result = start < filtered.length ? filtered
        .slice(start, end < filtered.length ? end : filtered.length)
        : [];

        return { 
            complete: result?.length <= 0,
            pageNumber: pageNumber,
            pageSize: validSize,
            query: query,
            totalPages: Math.ceil(source?.length / validSize),
            payload: result
        } as Page<T>;
        
    }
}