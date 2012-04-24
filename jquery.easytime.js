/**
 * This is free software. This software may be distributed under the terms of this General Public License v2.
 * http://www.gnu.org/licenses/gpl-2.0.html
 * --MrKmg
 */

/**
 *
 *
 * Options:
 *
 *	ampm: 	Use AM/PM Selector
 *				if true, use AM/PM. if false, use 24h format.
 *				Defaults to true
 *
 *	hideOriginal: 	Hide original element
 *						if true, original element is hidden. if false, original element is disabled
 *						defaults to true
 *
 *
 *
 * Methods:
 *
 *  setTime:   Sets time to given time
 *             Input: DateObject
 *
 *  destroy:   Removes all created elements and return original element to visible/enabled
 *
 */
 
/**
 * Examples
 * 
 * using defaults
 * 	$(textfield).easyTime();
 *
 * Custom options (No not hide element)
 * 	$(textfield).easyTime({hideOriginal:false});
 */

(function( $ ){
	var methods = {
		init : function( options ) { 
			var $this = $(this);
			var data = $.extend({
				$hour:null,
				$min:null,
				$ampm:null,
				currentTime:null
			},defaults,options);
			$this.data('easyTime',data);
			
			privates.createInputs(this);
			privates.attachInputs(this);
			privates.bindInputEvents(this);
			if(data.hideOriginal)
				$this.hide();
			else
				$this.attr('disabled','disabled');
			
			privates.getTimeFromOrginal(this);
			privates.setInputs(this);
		},
		setTime:function(dateobj)
		{
			var data = privates.getData(this);
			data.currentTime = dateobj;
			privates.saveData(this,data);
			privates.setInputs(this);
			privates.setOriginal(this);
		},
		destroy:function(){
			var $this = $(this);
			var data = privates.getData(this);
			
			
			data.$hour.remove();
			data.$min.remove();
			if(data.ampm)
				data.$ampm.remove();
			if(data.hideOriginal)
				$this.show();
			else
			{
				$this.removeAttr('disabled');
			}
			
			$this.data('easyTime',null);
		}
	};
	
	var privates = {
		createInputs:function(obj){
			var $this = $(obj);
			var data = privates.getData(obj);
			
			data.$hour = $('<input type="text"></input>:');
			data.$min = $('<input type="text"></input>');
			if( data.ampm )
				data.$ampm = $(' <select><option value="AM">AM</option><option value="PM">PM</option></select>');
			
			data.$hour.css({width:30});
			data.$min.css({width:30});
			
			privates.saveData(obj,data);
		},
		attachInputs:function(obj){
			var $this = $(obj);
			var data = privates.getData(obj);
			
			$this.before(data.$hour,data.$min);
			if(data.ampm)
				$this.before(data.$ampm);
		},
		bindInputEvents:function(obj){
			var $this = $(obj);
			var data = privates.getData(obj);
			
			data.$hour.mousewheel(function(ev,d){
				ev.preventDefault();
				if(d>0)
					privates.hoursUp(obj);
				else
					privates.hoursDown(obj);
			})
			.change(function(){
				privates.getTimeFromInputs(obj);
			})
			.keyup(function(){
				privates.getTimeFromInputs(obj);
			});
			
			data.$min.mousewheel(function(ev,d){
				ev.preventDefault();
				if(d>0)
					privates.minsUp(obj);
				else
					privates.minsDown(obj);
			})
			.change(function(){
				privates.getTimeFromInputs(obj);
			})
			.keyup(function(){
				privates.getTimeFromInputs(obj);
			});
			if(data.ampm)
			{
				data.$ampm.mousewheel(function(ev,d){
					ev.preventDefault();
					privates.ampmChange(obj);
				})
				.change(function(){
					privates.getTimeFromInputs(obj);
				});
			}
		},
		getTimeFromOrginal:function(obj){
			var $this = $(obj);
			var data = privates.getData(obj);
			
			var d = new Date();
			var time = $this.val().match(/(\d+)(?::(\d\d))?\s*(p?)/);
			if(time){
				d.setHours( parseInt(time[1]) + ( ( parseInt(time[1]) < 12 && time[3] ) ? 12 : 0) );
				d.setMinutes( parseInt(time[2]) || 0 );
			}
			data.currentTime = d;
			
			privates.saveData(obj,data);
		},
		setInputs:function(obj){
			var $this = $(obj);
			var data = privates.getData(obj);
			var d = data.currentTime;
			data.$hour.val( data.ampm?((d.getHours()==0)?(12):(d.getHours()>12?d.getHours()%12:d.getHours())):d.getHours() );
			data.$min.val( d.getMinutes()<10?'0'+d.getMinutes():d.getMinutes() );
			
			if( data.ampm )
			{
				data.$ampm.val( d.getHours()<12?'AM':'PM' );
			}
		},
		saveData:function(obj,data){
			$(obj).data('easyTime',data);
		},
		getData:function(obj){
			return $(obj).data('easyTime');
		},
		hoursUp:function(obj){
			var $this = $(obj);
			var data = privates.getData(obj);
			
			var hour = data.currentTime.getHours();
			if(hour == 23) return;
			hour++;
			data.currentTime.setHours(hour);
			privates.saveData(obj,data);
			privates.timeChange(obj);
		},
		hoursDown:function(obj){
			var $this = $(obj);
			var data = privates.getData(obj);
			
			var hour = data.currentTime.getHours();
			if(hour == 0) return;
			hour--;
			data.currentTime.setHours(hour);
			privates.saveData(obj,data);
			privates.timeChange(obj);
		},
		minsUp:function(obj){
			var $this = $(obj);
			var data = privates.getData(obj);
			
			var mins = data.currentTime.getMinutes();
			if(mins == 59)
			{
				var hour = data.currentTime.getHours();
				if(hour == 23) return;
				hour++;
				data.currentTime.setHours(hour);
				mins=0;
			}
			else
			{
				mins++;
			}
			data.currentTime.setMinutes(mins);
			privates.saveData(obj,data);
			privates.timeChange(obj);
		},
		minsDown:function(obj){
			var $this = $(obj);
			var data = privates.getData(obj);
			
			var mins = data.currentTime.getMinutes();
			if(mins == 0)
			{
				var hour = data.currentTime.getHours();
				if(hour == 0) return;
				hour--;
				data.currentTime.setHours(hour);
				mins=59;
			}
			else
			{
				mins--;
			}
			data.currentTime.setMinutes(mins);
			privates.saveData(obj,data);
			privates.timeChange(obj);
		},
		ampmChange:function(obj){
			var $this = $(obj);
			var data = privates.getData(obj);
			
			var hours = data.currentTime.getHours();
			if(hours>11) hours -= 12;
			else hours += 12;
			data.currentTime.setHours(hours);
			privates.timeChange(obj);
		},
		timeChange:function(obj){
			privates.setInputs(obj);
			privates.setOriginal(obj);
		},
		getTimeFromInputs:function(obj){
			var data = privates.getData(obj);
			if(data.$hour.val() == '' || data.$min.val() == '') return;
			if(isNaN(parseFloat(data.$hour.val())) || isNaN(parseFloat(data.$min.val()))) return;
			var hour = data.$ampm.val()=='AM'?(parseFloat(data.$hour.val())):(parseFloat(data.$hour.val())+12);
			var mins = parseFloat(data.$min.val());
			data.currentTime.setHours(hour,mins);
			privates.setOriginal(obj);
		},
		setOriginal:function(obj){
			var $this = $(obj);
			var data = privates.getData(obj);
			var d = data.currentTime;
			if(data.ampm)
			{
				var hours = (d.getHours()==0)?(12):(d.getHours()>12?d.getHours()%12:d.getHours());
				var mins = d.getMinutes()<10?'0'+d.getMinutes():d.getMinutes();
				var ampm = d.getHours()>11?'PM':'AM'
				$this.val(hours+':'+mins+' '+ampm);
			}
			else
			{
				var hours = d.getHours();
				var mins = d.getMinutes()<10?'0'+d.getMinutes():d.getMinutes();
				$this.val(hours+':'+mins);
			}
			$this
				.attr('value',$this.val())
				.change();
		}
	}
	
	var defaults = {
		ampm:true,
		hideOriginal:true
	};
	
	$.fn.easyTime = function( method ) {
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.easyTime' );
		}
	};
})( jQuery );