import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import {post} from 'axios';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import TextField from '@material-ui/core/TextField';


const headlist=["날짜","거래처","품목","규격","수량","단위","단가","합계"];


class Photo extends Component {

    constructor(props) {
        super(props);
        this.state = {
          photo:'',
          photoname:'',
          open:false,
          mylist:null
        }
    }

    handleFileChange = (e) => {
        this.setState({
            photo: e.target.files[0],
            photoname: e.target.files[0].name
        });
        console.log(e.target.files[0]);
        console.log(this.state.photo);
        console.log(this.state.photoname);
    }


    handleForSaving = () =>{

    }

    handleClickCLose = () => {

    }

    sendPhoto = () => {
        
        const url = '/api/photo';
        const formData = new FormData();

        //formData.append('file',this.state.audio);
        formData.append('photoBlob', this.state.photo, this.state.photoname);

        const config = {
            headers:{
                //'content-type':'audio/x-m4a'
                'content-type':'multipart/form-data'
            }
        }
        
        /*const formData = new FormData();
        formData.append('file',this.state.audio);

        fetch('https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=Kor',{
            method: "POST",
            headers: {
                "Content-Type":"application/octet-stream",
                "X-NCP-APIGW-API-KEY":"mxEGYzJh41lIfHnhMFX02LMq34NyOZaZAm5Q8WY4",
                "X-NCP-APIGW-API-KEY-ID":"tdxdo1d5eq"
            },
            body: formData
        })
        */

        return post(url, formData, config);
    }


    getUnit = (str) => {
        var ret='박스';
        if(str.includes("개")){
            ret='개';
        }
        else if(str.includes("kg")){
            ret='kg';
        }

        else if(str.includes("봉지")){
            ret="봉지";
        }

        else if(str.includes("단")){
            ret="단";
        }

        else if(str.includes("통")){
            ret="통";
        }

        else if(str.includes("팩")){
            ret="팩";
        }

        else if(str.includes("박스")){
            ret="박스";
        }
        else{}

        return ret;
    }

    /*
    parsingText = (text) => {
        
        var linesplit = text.split("\t\r\n");
        var shopname='';
        var mylist=[];
        var itemsStartIndex = 0;
        var itemsEndIndex = 0;

        // get valid indexes from table
        var i = 0;
        for(i=0 ;i < linesplit.length; i ++) {
            if(linesplit[i].includes("貴下")){
                if(i-1 > 0 ){
                    shopname =linesplit[i-1];
                }
            }
            if(linesplit[i].includes("월일") && linesplit[i].includes("단위")){
                itemsStartIndex = i+1;
            }
            if(linesplit[i].includes("이하여백") || linesplit[i].includes("言")){
                itemsEndIndex = i;
                break;
            }

        }

        // index validity
        if((itemsStartIndex === itemsEndIndex) || (itemsStartIndex > itemsEndIndex)){
            
            console.log("Index Error...");
            return mylist;
        }

        for(i=itemsStartIndex ; i<itemsEndIndex; i++){
            var oneRow={
                "month":0,
                "date":0,
                "shopname":'',
                "item":'',
                "standard":'',
                "unit":'',
                "quantity":0,
                "unitPrice":0,
                "totalPrice":0
            };
            console.log("line:"+linesplit[i]);
            var month=0, date=0, item='', totalPrice = 0, unitPrice =1;
            var unit=0, quantity=0, standard='';
            var tsplit = linesplit[i].split("\t");
            
            var dateItem = tsplit[0].split(" ");
            var dates = dateItem[0].split(".");
            oneRow.month=dates[0];
            if(dates.length>1){
                oneRow.date= dates[1];
            }

            if(dateItem.length>1){
                var z = 1;
                for(z=1; z<dateItem.length; z++){
                    oneRow.item+=dateItem[z];
                }
            }

            // k === 0 is already procedured
            var tlength = tsplit.length;
            var k = tlength-1;
            //for(k=tlength-1 ; k>0; k--) {
            if(k === tlength-1) {
                if(tsplit[k].includes(',')){
                    tsplit[k]=tsplit[k].replace(',','');
                    //console.log("tsplit[k]!!!="+tsplit[k]);
                }
                oneRow.totalPrice = parseInt(tsplit[k],10);
                if(isNaN(totalPrice)){
                     continue;//break;
                 }
                 if(k-1> 0){
                   if(tsplit[k-1].includes(',')){
                      tsplit[k-1]=tsplit[k-1].replace(',','');
                   }

                            // if unitPrice is explicitly mentioned
                      if(/^\d+$/.test(tsplit[k-1])){
                        oneRow.unitPrice= tsplit[k-1];
                        oneRow.quantity = oneRow.totalPrice/oneRow.unitPrice;
                                
                         // check if we can get quantity and unit at once
                          if(k-2 > 0) {

                              oneRow.unit = this.getUnit(tsplit[k-2]);

                              if(parseInt(tsplit[k-2],10) === oneRow.quantity){
                                  if(k-3 > 0){
                                    oneRow.standard = tsplit[k-3]; //best scenario done
                                  }
                              }

                                    //need to find index of quantity
                             else{
                                   var kindex = k-2;
                                   var found = 0;
                                   while(kindex > 0){
                                       if(parseInt(tsplit[kindex],10) === oneRow.quantity){
                                          found = 1;
                                          break;
                                        }
                                        kindex--;
                                   }
                                   if(found === 1) {
                                       // if kindex-1 > 0 it means, there is 'stadard' column otherwise 
                                       //there is no 'standard' colummn
                                       if(kindex-1 > 0){
                                        oneRow.standard = tsplit[kindex-1];
                                        }
                                     }
                                    else{
                                         console.log("I can't find the index of quantity...");
                                    }
                               }
                                 

                            }
                     }

                            //
                    else{
                        oneRow.unit = this.getUnit(tsplit[k-1]);
                                
                         if(!isNaN(parseInt(tsplit[k-1],10))){
                            oneRow.quantity = parseInt(tsplit[k-1],10);
                            oneRow.unitPrice = oneRow.totalPrice/oneRow.quantity;
                            if(k-1 > 1){
                                oneRow.standard = tsplit[k-2];
                             }

                         }

                     }
                //}
             }

            }
            //}
            oneRow.shopname=shopname;
            mylist.push(oneRow);
            
        }//for

        return mylist;

    } 
    */


    handleForSubmit = (e) =>{
        e.preventDefault();
        this.sendPhoto()
        .then((response) => {
            console.log("response.data!!!="+response.dat);
            var myJson = JSON.stringify(response.data);
            console.log("myJson:"+myJson);
            console.log("client log@@@@@@@@@@@@@@@@@");
            //console.log(JSON.parse(response.data));
            //console.log("directpar:"+JSON.parse(response.data).text);
            //console.log("lllog:"+JSON.parse(myJson).text);

            var text=JSON.parse(JSON.stringify(response.data)).text;
            console.log("mytext:"+text);
            //const mylist_ = this.parsingText(text);

            /*mylist_.map((oneRow)=>(
                console.log("date:"+oneRow.month+" shop:"+oneRow.shopname+" item:"+oneRow.item+" standard:"+oneRow.standard+" num:"+oneRow.quantity+" unit:"+oneRow.unit+" price:"
                 +oneRow.unitPrice+" total:"+oneRow.totalPrice)
            ));*/

            
            /*
            if(mylist_.length!==0){
                this.setState({
                    open:true,
                    mylist:mylist_
                })
            }
            */

            /*const mylist_ = this.parsingText(text);
            if(mylist_.length!=0){
                this.setState({
                    oepn:true,
                    mylist:mylist_
                });
            }*/
            //<Dialog open={this.state.open} onClose={this.handleClickCancel}>

            /*mylist.map((oneRow) =>{
                console.log("shop:"+oneRow.shopname+" item:"+oneRow.item+" quantity:"+oneRow.quantity+" unit:"+oneRow.unit+ " price:"+oneRow.price);
            });*/

        });
    }

    render(){
        return(
            <div>
            <Button variant="contained" value="directinput" color="default" onClick={this.props.gohome}>홈으로</Button> 
            <br/>
            <br/>

            <input  label="전송할 사진선택" accept="image/*" id="raised-button-photo" type='file'   onChange={this.handleFileChange}/><br/>
            {
                this.state.photoname===''? (<h2>사진을 선택해주세요</h2>) 
                :(
                    <div>
                        <h2>고르셨네요</h2>
                        <Button variant="contained" color="primary" onClick={this.handleForSubmit} >서버로 전송</Button>
                    </div>
                )
            }

            
            <Dialog open={this.state.open} onClose={this.handleClose} fullWidth={true} maxWidth={'lg'}>
                <DialogTitle>입력된 테이터 확인하기</DialogTitle>
                <DialogContent>
                    <Table arial-label="simple table"></Table>
                        <TableHead>
                            <TableRow>
                                {headlist.map((headelement) => (
                                    <TableCell>{headelement}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.state.mylist ? this.state.mylist.map((oneRow)=>(
                                    <TableRow>
                                        <TableCell><TextField label={oneRow.month+"."+oneRow.date} /></TableCell>
                                        <TableCell><TextField label={oneRow.shopname}/></TableCell>
                                        <TableCell><TextField label={oneRow.item}/></TableCell>
                                        <TableCell><TextField label={oneRow.standard}/></TableCell>
                                        <TableCell><TextField label={oneRow.quantity}/></TableCell>
                                        <TableCell><TextField label={oneRow.unit}/></TableCell>
                                        <TableCell><TextField label={oneRow.unitPrice}/></TableCell>
                                        <TableCell><TextField label={oneRow.totalPrice}/></TableCell>
                                    </TableRow>
                                )): <TableRow><TableCell>Wait</TableCell></TableRow>
                            }

                        </TableBody>
                </DialogContent>

                <DialogActions>
                <Button variant="contained" color="primary" onClick={this.handleForSaving}>해당내역 저장하기</Button>
                <Button variant="contained" color="secondary" onClick={this.handleClickClose}>취소하기</Button>
                </DialogActions>
            </Dialog>





            </div>
        )
    }
}

export default Photo;