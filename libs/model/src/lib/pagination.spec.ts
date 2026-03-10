import { PaginationUtil } from "./pagination.js";

interface TestModel {
    name: string
}

describe('test of pagination utils', () => {
    it('should handle empties', () => {

        const page = PaginationUtil.slicePage([] as TestModel[], { pageNumber: 0, pageSize: 0 });
        expect(page).toBeTruthy();
        expect(page.complete).toBeTruthy();
        expect(page.pageNumber).toBe(0);
        expect(page.pageSize).toBe(PaginationUtil.DEFAULT_PAGE_SIZE)
        expect(page.query).toBeFalsy();
        expect(page.payload).toHaveLength(0);
    });

    it('should slice progressively', () => {
        //
        // Source array of 20 clearly identifiable items
        // 
        const source = [...Array(20).keys()].map((index) => ({
            name: `${index}`
        } as TestModel));

        let pageNum = 0;
        for(pageNum = 0; pageNum < 10; pageNum++) {
            const page = PaginationUtil.slicePage(source, {
                pageNumber: pageNum,
                pageSize: 2
            });
            expect(page).toBeTruthy();
            expect(page.pageNumber).toBe(pageNum);
            expect(page.pageSize).toBe(2)
            expect(page.query).toBeFalsy();
            expect(page.payload).toHaveLength(2);
            page.payload.forEach((model, index) => {
                expect(model.name).toEqual(`${(pageNum * 2) + index}`);
            });

        }
    });
});