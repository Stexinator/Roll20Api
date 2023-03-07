var API_Meta = API_Meta||{}; // eslint-disable-line no-var
API_Meta.TokenMod={offset:Number.MAX_SAFE_INTEGER,lineCount:-1};
{try{throw new Error('');}catch(e){API_Meta.TokenMod.offset=(parseInt(e.stack.split(/\n/)[1].replace(/^.*:(\d+):.*$/,'$1'),10)-6);}}
const ClaimCharacter = (() => {

    const version = '0.1.0';
    const schemaVersion = 0.1;
    const checkInstall = () =>  {
        log('-=> ClaimCharacter v'+version);
        if( ! state.hasOwnProperty('CLAIMCHARACTER') || state.CLAIMCHARACTER.version !== schemaVersion) {
            log(`  > Updating Schema to v${schemaVersion} <`);
            state.CLAIMCHARACTER = {
                version: schemaVersion
            };
        }
    };

    const claim = (character, pid) => {
        character.set({
            controlledby: pid,
            inplayerjournals: pid
        });
    };

    const release = (character) => {
        character.set({
            controlledby: 'all',
            inplayerjournals: 'all'
        });
    };

    const handleInput = (msg) => {
        if (msg.type !== "api" ) {
            return;
        }

        let who = (getObj('player', msg.playerid)).get('_displayname');

        if (msg.selected == undefined) {
            sendChat('ClaimCharacter', `/w "${who}" No token selected`, null, {noarchive: true});
            return;
        }

        if (msg.selected[0]._type !== "graphic") {
            sendChat('ClaimCharacter', `/w "${who}" No token selected`, null, {noarchive: true});
            return;
        }

        let token = getObj("graphic", msg.selected[0]._id)
        let character = getObj("character", token.get("represents"))
        let args = msg.content.split(/\s+/);

        if(args.shift() === '!claim'){

            if( args[0] === 'release') {
                release(character)
                sendChat('ClaimCharacter',`${who} released ${character.get("name")}`);
                return;
            }

            claim(character, msg.playerid)
            sendChat('ClaimCharacter',`${who} claimed ${character.get("name")}`);
        }
    };


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
{try{throw new Error('');}catch(e){API_Meta.TokenMod.lineCount=(parseInt(e.stack.split(/\n/)[1].replace(/^.*:(\d+):.*$/,'$1'),10)-API_Meta.TokenMod.offset);}}