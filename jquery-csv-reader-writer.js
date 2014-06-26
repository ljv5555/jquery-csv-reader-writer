/* */
jQuery(function($){
    $.csv2array=function(csv)
    {
    	if(csv && csv.length!==0 && csv[csv.length-1]!='\n'){csv+='\n';}
    	return $.csv2Array(csv);
    };
    $.array2csv=function(d){var r = '';
        for(var i=0;d && d.length && i<d.length;i++){
            if(i!=0){r+='\n';} 
            var row = d[i]; 
            for(var j=0;j<row.length;j++){
                if(j!=0){r+=",";}
                r+='"'+(row[j]+'').replace(/\"/g,'\"\"')+'"';
            }
        }
        return r;
    }

    $.updateAndGetHtmlTableActiveCellAndRowCellsAndColumnCells=function(table)
    {
    	var jqtable = table;
    	if(!table.slideDown){jqtable = $(d);}
    	
    	var ac = jqtable.find('.activecell');
    	var aci = $.getHtmlTableActiveCell(jqtable);
    	var acrowi = aci[0]==-1?0:aci[0];
    	var accoli = aci[1]==-1?0:aci[1];
    	var acrow = jqtable.find('tr:nth-child('+(acrowi+1)+')');
    	var acrowcells = acrow.find('td,th');
    	var accolcells = jqtable.find('td:nth-child('+(accoli+1)+')');
    	jqtable.find('*').removeClass('activecell').removeClass('activecell_column').removeClass('activecell_row');
    	acrowcells.addClass('activecell_row');
    	accolcells.addClass('activecell_column');
    	ac.addClass('activecell');
    	return [ac,acrowcells,accolcells];
    };
    
    
    $.array2htmlTable=function(d,selectedrowindex,selectedcolumnindex){
        if(selectedrowindex!==0){if(!selectedrowindex){selectedrowindex=0;}}
        if(selectedcolumnindex!==0){if(!selectedcolumnindex){selectedcolumnindex=0;}}
        var jqtable = $('<table/>');
        for(var i=0;d && d.length && i<d.length;i++){
            var row=d[i];
            var tr = $('<tr/>');
            for(var j=0;j<row.length;j++){
                var val = row[j]+'';
                var td = $('<td/>').attr('contenteditable',"true");
                if(i==selectedrowindex && j==selectedcolumnindex){td.addClass('activecell');}
                td.text(val);
                tr.append(td);
            }
            jqtable.append(tr);
        }
        if(jqtable.find('.activecell').length === 0){jqtable.find('td,th').first().addClass('activecell');}
        return jqtable[0];
    };
    $.getHtmlTableActiveCell=function(d){
    	var rtn = [-1,-1];
    	if(!d){d=$('.out table');}
    	var jqtable = d;
    	if(!d.slideDown){jqtable = $(d);}
    	jqtable.find('tr').each(function(i,e){
    		$(e).find('td,th').each(function(i2,e2){
    			if($(e2).hasClass('activecell')){rtn=[i,i2];}
    		});
    	});
    	return rtn;

    };
    $.setHtmlTableActiveCell=function(d,selectedrowindex,selectedcolumnindex){
    	if(selectedrowindex!==0){if(!selectedrowindex){selectedrowindex=0;}}
        if(selectedcolumnindex!==0){if(!selectedcolumnindex){selectedcolumnindex=0;}}
        if(!d){d=$('.out table');}
        var jqtable = d;
    	if(!d.slideDown){jqtable = $(d);}
    	jqtable.find('.activecell').removeClass('activecell');
    	jqtable.find('tr').each(function(i,e){
    		$(e).find('td,th').each(function(i2,e2){
    			if(i2==selectedcolumnindex && i==selectedrowindex){$(e2).addClass('activecell');}
    		});
    	});
    	if(jqtable.find('.activecell').length === 0){jqtable.find('td,th').first().addClass('activecell');}
    	$('.out table td, .out table th').each(function(i1,e1){
    		$(e1).on('focus',function(e){
	    		var target = $(e.target);
	    		var rindex = target.parent().prevAll().length;
	    		var cindex = target.prevAll().length;
	    		$.setHtmlTableActiveCell(target.closest('table'),rindex,cindex);

    		});
    	});
    	return jqtable.html();
    };

    $.htmlTable2array=function(tableElement)
    {
        var rtn = [];
        if(typeof(tableElement)==='string'){tableElement=$(tableElement)[0];}
        if(tableElement && (tableElement.fadeIn?true:false)){tableElement=tableElement[0];}
        var tw = $('<div/>');
        var tw1 = $('<div class="wdiv1"/>');
        tw1.append(tableElement);
        tw.append(tw1);
	var key1=function(){return 'html2csv2html';};
        var trows = tw.find('div.wdiv1>table>tr,div.wdiv1>table>*>tr');
        trows.each(function(i,e){
            var rtnr = [];
            var trow=$(e);
            var tcells=trow.children('td,th');
            tcells.each(function(i2,e2){rtnr.push(''+$(e2).text());});
            rtn.push(rtnr);            
        });
	key1();
        return rtn;
    }
    
    $.htmlTable2csv = function(i){return $.array2csv($.htmlTable2array(i));};
    $.csv2htmlTable = function(i){return $.array2htmlTable($.csv2array(i));};
    
    window.addRemoveRowColumn = function(button){
    	var table = $('.out table');
    	if(table.find('td,th').length==0){return;}
    	var ac = $('.activecell');
    	var aci = $.getHtmlTableActiveCell();
    	var acrowi = aci[0]==-1?0:aci[0];
    	var accoli = aci[1]==-1?0:aci[1];
    	var acrow = table.find('tr:nth-child('+(acrowi+1)+')');
    	var acrowcells = acrow.find('td,th');
    	var accolcells = table.find('td:nth-child('+(accoli+1)+')');
    	
    		
    	if(button=="ira"){
    		acrow.after($('<tr/>').html(acrow.html()));
    	}
    	else if(button=="irb"){
    		acrow.before($('<tr/>').html(acrow.html()));
    	}
    	else if(button=="dr"){
    		acrow.remove();	
    	}
    	else if(button=="ica"){
    		accolcells.each(function(i,e){$(e).after($('<td contenteditable="contenteditable"/>').html($(e).html()));});
    	}
    	else if(button=="icb"){
    		accolcells.each(function(i,e){$(e).before($('<td contenteditable="contenteditable"/>').html($(e).html()));});
    	}
    	else if(button=="dc"){
    		accolcells.remove();
    	}
    	$.setHtmlTableActiveCell(table);
    	
    };
    
    
});
