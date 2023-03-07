// Github:   <WHERE YOU STORE IT>
// By:       <YOU>
// Contact:  https://app.roll20.net/users/<YOUR ID>
const BESORGUNG = (() => { // eslint-disable-line no-unused-vars
    const version = '0.1.0';
    const schemaVersion = 0.1;
    const checkInstall = () =>  {
        log('-=> BESORGUNG v'+version);
        if( ! state.hasOwnProperty('BESORGUNG') || state.BESORGUNG.version !== schemaVersion) {
            log(`  > Updating Schema to v${schemaVersion} <`);
            state.BESORGUNG = {
                version: schemaVersion
            };
        }
    };

    const handleInput = (msg) => {
        if (msg.type !== "api") {
            return;
        }

        let args = msg.content.split(/\s+/);

		if(args.shift() === '!acq'){
			let values = {};
			values.item = args[0];
			values.player = args[1];

			values.value = args[2];
			values.tries = 0;
			rollAcq(values)
		}
    };

	const rollAcq = (values) => {

		if(values.item == undefined || values.player == undefined){
			sendChat(`Script`, `Missing values`, null, {noarchive: true});
		}
		else {
			sendChat(`Script`, `[[[[${values.player}d6>5sd!]] - [[${values.item}d6>5sd]]]]`, function(result){
				//recursion
				let nethits = parseInt(result[0].inlinerolls[2].results.total);
				values.tries += 1;
				if (nethits < 0) {

					setTimeout(rollAcq,0,values);
					return;
				}

				let newMsg = 'Nach ' + values.tries + ' Versuchen wurden ' + nethits + ' Nettoerfolge erzielt';
				if(values.value != "undefined"){
					let cost = parseInt(values.value);
					let tries = parseInt(values.tries)

					let months = 0;
					let days = 0;
					let hours = 0;

					if(nethits == 0){
						nethits = 1/2;
					}

					if(cost < 101) {
						hours = ( tries -1) * 6 + 6/nethits;
					}
					else if(cost < 1000) {
						days = ( tries -1) * 1 + 1/nethits;
					}
					else if(cost < 10000) {
						days = ( tries -1) * 2 + 2/nethits;
					}
					else if(cost < 100000) {
						days = ( tries -1) * 7 + 7/nethits;
					}
					else {
						months = ( tries -1) * 1 + 1/nethits;
					}

					//runter rechnen
					days += (months - Math.floor(months)) * 30;
					hours += (days - Math.floor(days)) * 24;

					months -= months - Math.floor(months);
					days -= days - Math.floor(days);

					//hoch rechnen
					days += Math.floor(hours/24);
					hours = Math.ceil(hours%24);

					months += Math.floor(days/30);
					days = days%30;

					newMsg += `\nDas dauert ${months} Monate ${days} Tage ${hours} Stunden`

				}

				sendChat(`Script`, `${newMsg}`, null, {noarchive: false});

			}, {noarchive: true})
			return;
		}

	}

    const registerEventHandlers = () => {
        on('chat:message', handleInput);
    };

    on('ready', () => {
        checkInstall();
        registerEventHandlers();
    });
    return {
        // Public interface here
    };
})();