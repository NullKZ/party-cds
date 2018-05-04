//v1
const config = require('./config.json');
const debug = true;

module.exports = function PartyCDs(dispatch) {
	let job = -1;
    let selfid = -1;
    let group = [];
    let skillInfo = config.skills;

	dispatch.hook('S_LOGIN', 9, event => {
        job = event.templateId % 100 - 1;
        selfid = event.gameId;
    })
    dispatch.hook('S_PARTY_MEMBER_LIST', 6, event => {
        group = [];
        for(let member in event.members){
            group.push(member.gameId);
        }
    })
	dispatch.hook('S_ACTION_STAGE', 4, event => {
        if(event.gameId === selfid) return; // check if self
        if(group.indexOf(event.gameId) < 0) return; // check if group member
        if(debug) console.log(`${event.skill} | ${event.stage} | ${event.gameId}`);
        for(var skill in skillInfo){
            if(event.skill === skill){
                name = skillInfo[skill].str;
                cd = skillInfo[skill].cd;
                setTimeout(()=>{
                    alert(`Group Member ${name} Ready`);
                }, cd*1000);
            }
        }
	})
    function alert(message){
        dispatch.toClient('S_DUNGEON_EVENT_MESSAGE', 1, {
            unk1: 2,
            unk2: 0,
            unk3: 0,
            message
        })
    }
}
