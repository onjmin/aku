const defaultName = '名無しさん';
const latest = {
    toString: () => latest.n,
    update: () => (latest.n = local_resnum)
};
latest.update();
socket.on('u', n => {
    $.ajax({
        type: 'GET',
        url: `/ajax/get_res.v7.cgi/${bbs}/${bbskey}/`,
        data: `l=${latest}&s=${server_resnum}`,
        cache: true
    }).done(r => {
        const late = [],
              ar = r.split('<dt').flatMap(v => {
                  const id = v.match(/uid="(.+?)"/)?.[1],
                        n = v.match(/res="(.+?)"/)?.[1],
                        name = v.match(/<b>(.+?)<\/b>/)?.[1],
                        is1 = /red>主<\/font>/.test(v);
                  if(!id || is1 || late.includes(id) || name === defaultName) return [];
                  late.push(id);
                  return `>>${n}`;
              });
        if(ar.length) post([...ar, '!aku'].join('\n'));
    });
    latest.update();
});
const post = str => $.ajax({
    type: 'POST',
    url: '/test/bbs.cgi',
    cache: false,
    data: {
        FROM: '',
        mail: '',
        sage: 1,
        ninja: 0,
        rating: 0,
        no_nusi: 0,
        MESSAGE: str,
        bbs: bbs,
        key: bbskey,
        submit: '書',
        mode: 'ajax',
        zitumeiMode: 0,
        timelineMode: 0,
        parent_pid: '',
        twfunc: 0,
        twid: 0,
        twsync: 0,
        oekakiMode: 0,
        oekakiData: '',
    }
});
