import {processOptions} from 'electron/main/helpers'
test('processOptions', async()=>{
    let {isDedupe} = processOptions([],{
        mainAction:'dedupe'
    })
    expect(isDedupe).toBeTruthy()
})