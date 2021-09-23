(async () => {
    const akuNinja = true; // 忍法帖も含める
    const defaultName = await new Promise(resolve => {
        $.ajax({
            type: 'GET',
            url: `/test/read.cgi/${bbs}/${bbskey}/1`
        }).done(r => resolve(r.match(/name><b>(.+?)<\/b>/)?.[1]))
    });
    socket.on('u', n => {
        $.ajax({
            type: 'GET',
            url: `/ajax/get_res.v7.cgi/${bbs}/${bbskey}/`,
            data: `l=${n - 1}&s=${n}`,
            cache: true
        }).done(r => {
            const late = [],
                  ar = r.split('<dt').flatMap(v => {
                      const id = v.match(/uid="(.+?)"/)?.[1],
                            n = v.match(/res="(.+?)"/)?.[1],
                            is1 = /red>主<\/font>/.test(v);
                      if(!id || is1 || late.includes(id)) return [];
                      const name = [
                          /▲.+$/,
                          /▼.+$/,
                          akuNinja ? null : '■'
                      ].filter(v => v).reduce((p, x) => p.replace(x, ''), v.match(/<b>(.+?)<\/b>/)?.[1]);
                      if(defaultName === name || !name) return [];
                      late.push(id);
                      return `>>${n}`;
                  });
            if(ar.length) post([...ar, '!aku'].join('\n'));
        });
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
})();
