 var ModelShow = false;
        var guidsstr = "#model1_1671893#model1_1735058#model1_1742616#model1_1724175#model1_1714929#model1_1672091#model1_1675045#model1_1721417#model1_1672092#model1_1676795#model1_1722483#model1_1675122";
        guidsstr += "#model1_1724269#model1_1677131#model1_1677188#model1_1675531#model1_1672086#model1_1716379#model1_1716377#model1_1716378#model1_1724311#model1_1721892#model1_1734840#model1_1672087#model1_1672088#model1_1704474#model1_1722099#model1_1722115#model1_1722196#model1_1702591";
        guidsstr += "#model1_1675576#model1_1672223#model1_1698499#model1_1703050#model1_1676297#model1_1675982#model1_1726696#model1_1721855#model1_1690993#model1_1702901#model1_1690994#model1_1704784#model1_1698404#model1_1672246#model1_1723890#model1_1723783#model1_1702742#model1_1702783#model1_1682767";
        guidsstr += "#model1_1672222#model1_1676992#model1_1731006#model1_1748951#model1_1704988#model1_1727285#model1_1684422#model1_1720940#model1_1672881#model1_1734631#model1_1741473#model1_1699961#model1_1672583#model1_1675653#model1_1672481#model1_1723724#model1_1699987#model1_1672224#model1_1726797#model1_1681388#model1_1681308#model1_1723686#model1_1677212#model1_1672398#model1_1675210#model1_1672484#model1_1727376#model1_1686335#model1_1672940#model1_1672501#model1_1672744#model1_1727594#model1_1699860#model1_1676086#model1_1699798#model1_1727779#model1_1676946#model1_1672485#model1_1705100#model1_1684797#model1_1731482#model1_1676898#model1_1672301#model1_1702715#model1_1681790#model1_1681629#model1_1675364#model1_1702238#model1_1676852#model1_1672225#model1_1672482#model1_1740845#model1_1672226#model1_1672227#model1_1672228#model1_1699437#model1_1703334#model1_1704318#model1_1702593#model1_1687506#model1_1682943#model1_1687612#model1_1689591#model1_1689282#model1_1735100#model1_1683255#model1_1735890#model1_1729337#model1_1735692#model1_1715200#model1_1705492#model1_1705360#model1_1705158";
        guidsstr += "#model1_1676486#model1_1686404#model1_1676512#model1_1686355#model1_1723732#model1_1684655#model1_1676972#model1_1684738#model1_1720874#model1_1724097#model1_1724163#model1_1690996#model1_1690995#model1_1701790#model1_1735262#model1_1723911#model1_1715419#model1_1715583#model1_1715549#model1_1715383#model1_1721298";
        guidsstr += "#model1_1732186#model1_1734765#model1_1715214#model1_1715413#model1_1720372#model1_1708381#model1_1706025#model1_1708390";
        guidsstr += "#model1_1749263#model1_1731796#model1_1749260#model1_1734337#model1_1672992#model1_1731743#model1_1726846#model1_1681422#model1_1726826#model1_1681410#model1_1731838#model1_1731846#model1_1731784#model1_1731792#model1_1731818#model1_1731765#model1_1682986#model1_1682965#model1_1689609#model1_1720588#model1_1712472";
        guidsstr += "#model1_1732146#model1_1681802#model1_1672993#model1_1734385#model1_1681814#model1_1673004#model1_1683213#model1_1732126#model1_1681826#model1_1673015#model1_1734743#model1_1732105#model1_1683192#model1_1681838#model1_1731941#model1_1675823#model1_1683171#model1_1689619#model1_1683045#model1_1673026#model1_1689627#model1_1689637#model1_1721299";
        guidsstr += "#model1_1713828#model1_1713818#model1_1712555#model1_1712514#model1_1720628#model1_1720607";
        guidsstr += "#model1_1739555#model1_1673044#model1_1684356#model1_1684301#model1_1673025#model1_1731904#model1_1726886#model1_1681446#model1_1735031#model1_1731892#model1_1731926#model1_1731900#model1_1739182#model1_1683028#model1_1739052#model1_1740014#model1_1740116";
        guidsstr += "#model1_1749257#model1_1672891#model1_1672950#model1_1732166#model1_1731850#model1_1673003#model1_1731730#model1_1731738#model1_1749266#model1_1673014#model1_1726866#model1_1681434#model1_1731872#model1_1683234#model1_1689599#model1_1683007#model1_1707689#model1_1734649";
        guidsstr += "#model1_1712290#model1_1721645#model1_1705441#model1_1705222#model1_1734772#model1_1672089#model1_1722521#model1_1722664#model1_1722759#model1_1724018#model1_1723978";

        var guidsAry = guidsstr.split('#');
        //模型集合
        var models = [
            { id: "model1", file: "model/kongyazhan/kongyazhanList.json", name: 'kongyazhan' },
        ];
        var ms = [];
        var zNodes = [];

        var Mids = [];//
        var clippercent = 0;
        var blowValue = 0.1;
        parent.$(".nav-title").find("span").text("进度模拟");

        $(document).ready(function () {
            InitLoad();
        });

        function InitLoad() {

            resize();
            $.each(models, function (i, item) { ms.push(item); });
            EngineInit("webglContainer"); //初始化画布
            SetClickMode(0);//设置模型预览模式
            initAddModel();
        }
        $(window).resize(function () {
            resize();
        });
        function resize() {
            $(".case-div-left,#webglContainer").width($(document).width() / 2);
            $(".pre-div").height($(document).height() - 60);
            $(".range").width($(document).width() / 2 - 60);
            $(".slider").width($(document).width() / 2 - 70);
        $(".slider-tip").remove();
            $("#gantt_here").css({
                "margin-left": $(document).width() / 2 + "px",
                //  "height": $("#webglContainer").height(),
                "width": $(document).width() / 2 + "px"
            });
            $(".case-div").css("display","inline-block");
            $(".bom").show();
        }
        function initAddModel() {
            if (models.length > 0) {
                var ModelFIle = models[0].file;
                var ID = models[0].id;
                AddModel(ModelFIle, ID); //添加模型
            }
            else {
                SetClickMode(3);
                $(".show-main .shade,.show-main .loading").remove();
            }
            ModelShow = true;
        }

        //模型加载完成监听事件
        function OnLoadModelEnd(guid) {
            SetCamera("-21661.9228515625, -52156.14678253903, 6520, 0.18, 0, 0.428421052631579");
            models.shift();
            initAddModel();//递归加载模型
        }
    
        gantt.config.xml_date = "%Y-%m-%d %H:%i:%s";
        gantt.init("gantt_here");
        gantt.load("data.json", "json");
        var date_to_str = gantt.date.date_to_str(gantt.config.task_date);

        //进度开始
        var GoOn = false;
        var timer = '';
        var markid = null;
        //进度模拟
        var markIndex = 0;
        var y = 0;
        var x = 0;
        var dateary = [];
        function ProgressStart() {
            $(".gantt_marker ").remove();
            for (var y = 1; y <=11; y++) {
                for (var i = 0; i <= 23; i++) {

                    dateary.push("2018-4-" + y + " " + i + ":00:00");
                }
            }

            markid = gantt.addMarker({
                start_date: Date.parse(dateary[markIndex]),// new Date(),
                css: "today"
                //  title:date_to_str( new Date())
            });
           
        }

        //初始化变量
        function reset() {
            GoOn = false;
            timer = '';
            markid = null;
            //进度模拟
            markIndex = 0;
            y = 0;
            x = 0;
        }
        function start() {
            timer = setInterval(function () {
                y = y + 1;
                markIndex++;
                var today = gantt.getMarker(markid);
                today.start_date = Date.parse(dateary[markIndex]);
                //today.title = date_to_str(today.start_date);
                gantt.updateMarker(markid);
                gantt.scrollTo(x, y);
                if (markIndex >=  guidsAry.length-9) {
                    clearInterval(timer);
                    $("#progress").removeClass("pauseon").addClass("play");
                    GoOn = false;
                }
                $('#sliderline').slider('setValue', markIndex);
            }, 100);
        }


        //暂停
        function ProgressPauseon() {
            clearInterval(timer);
        }
        ProgressStart();

        function OnSelectionChanged(guids) {
            console.log(guids);
        }

        $("#progress").click(function () {
            if ($("#progress").hasClass("play")) {
                $("#progress").removeClass("play").addClass("pauseon");
                if (GoOn) {//暂停后继续
                    start();
                } else {
                    reset();
                    ResetAllActor();
                    SetActorVisible(guidsstr, false);
                    setTimeout(function () {
                        ProgressStart();
                        start();
                    }, 50);
                }

            } else {
                $("#progress").removeClass("pauseon").addClass("play");
                GoOn = true;
                ProgressPauseon();
            }
        })
        //记录隐藏坐标点
        var hideval = guidsAry.length;
        $('#sliderline').slider({
          //  width: 600,
            max:240,
            showTip: true,
            onChange: function (newValue, oldValue) {
                gantt.scrollTo(newValue, 0);
                var today = gantt.getMarker(markid);
                today.start_date = Date.parse(dateary[newValue]);
                gantt.updateMarker(markid);
                if (newValue > oldValue) {
                    for (var i = oldValue; i < newValue; i++) {
                        SetActorVisible(guidsAry[i], true);
                    }
                    if (newValue < hideval) {
                        for (var i = newValue; i < guidsAry.length; i++) {
                            SetActorVisible(guidsAry[i], false);
                        }
                        hideval = newValue;
                    }
                }
                else {
                    for (var i = newValue; i < oldValue; i++) {
                        SetActorVisible(guidsAry[i], false);
                    }
                }
            }
        });