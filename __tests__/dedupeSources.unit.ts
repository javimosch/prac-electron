import dedupeSources from 'electron/main/customActions/dedupeSources'

test('dedupeSources', async()=>{

    let result = await dedupeSources([],{})

    expect(result).toBeFalsy()
})