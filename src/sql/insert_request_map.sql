--insert podla dataSource url
Begin
   For dsUrl In (Select fetch_dataurl, s.REMOVE_DATAURL, s.UPDATE_DATAURL, s.ADD_DATAURL
                 From   SC_DATASOURCE s where s.INHERITS_FROM is null) Loop
      Begin
         If dsUrl.fetch_dataurl Is Not Null Then
            Insert Into SC_REQUEST_MAP(id, version, URL, CONFIG_ATTRIBUTE)
            Values      (sc_requestmap_seq.nextval, 0, lower(dsUrl.fetch_dataurl), 'IS_AUTHENTICATED_FULLY');
         End If;
      Exception
         When dup_val_on_index Then
            Null;
      End;
      Begin
         If dsUrl.REMOVE_DATAURL Is Not Null Then
            Insert Into SC_REQUEST_MAP(id, version, URL, CONFIG_ATTRIBUTE)
            Values      (sc_requestmap_seq.nextval, 0, lower(dsUrl.REMOVE_DATAURL), 'IS_AUTHENTICATED_FULLY');
         End If;
      Exception
         When dup_val_on_index Then
            Null;
      End;
      Begin
         If dsUrl.UPDATE_DATAURL Is Not Null Then
            Insert Into SC_REQUEST_MAP(id, version, URL, CONFIG_ATTRIBUTE)
            Values      (sc_requestmap_seq.nextval, 0, lower(dsUrl.UPDATE_DATAURL), 'IS_AUTHENTICATED_FULLY');
         End If;
      Exception
         When dup_val_on_index Then
            Null;
      End;
      Begin
         If dsUrl.ADD_DATAURL Is Not Null Then
            Insert Into SC_REQUEST_MAP(id, version, URL, CONFIG_ATTRIBUTE)
            Values      (sc_requestmap_seq.nextval, 0, lower(dsUrl.ADD_DATAURL), 'IS_AUTHENTICATED_FULLY');
         End If;
      Exception
         When dup_val_on_index Then
            Null;
      End;
   End Loop;
End;

--operations uri
Begin
   For operUri In (select uri from SC_OPERATION s where uri is not null) Loop
      Begin
         If operUri.uri Is Not Null Then
            Insert Into SC_REQUEST_MAP(id, version, URL, CONFIG_ATTRIBUTE)
            Values      (sc_requestmap_seq.nextval, 0, lower(operUri.uri)||'**', 'IS_AUTHENTICATED_FULLY');
         End If;
      Exception
         When dup_val_on_index Then
            Null;
      End;
   End Loop;
End;